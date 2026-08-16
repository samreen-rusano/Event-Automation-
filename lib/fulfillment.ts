import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { transporter } from "@/lib/mailer";
import { getEmailForTransactionType } from "@/lib/emailTemplate";

export async function fulfillPurchase(paymentIntent: Stripe.PaymentIntent) {
  if (paymentIntent.status !== "succeeded") {
    console.error(`[Fulfillment] PaymentIntent ${paymentIntent.id} is not succeeded (status: ${paymentIntent.status}). Skipping fulfillment.`);
    return;
  }

  const name = paymentIntent.metadata?.name || "";
  const phone = paymentIntent.metadata?.phone || "";
  const email = paymentIntent.receipt_email || paymentIntent.metadata?.email || "";
  const transactionType = paymentIntent.metadata?.transactionType || "";

  if (!email) {
    console.error(`[Fulfillment] No email found for PaymentIntent ${paymentIntent.id}.`);
    return;
  }

  if (!transactionType) {
    console.error(`[Fulfillment] No transactionType found in metadata for PaymentIntent ${paymentIntent.id}.`);
    return;
  }

  // Amount + Metadata Validation (Section 49)
  const amount = paymentIntent.amount;
  let isValid = false;
  if (transactionType === "framework" && amount === 1700) {
    isValid = true;
  } else if (transactionType === "framework_sop" && amount === 4400) {
    isValid = true;
  } else if (transactionType === "upsell57" && amount === 5700) {
    isValid = true;
  }

  if (!isValid) {
    console.error(`[Fulfillment] Security alert! PaymentIntent ${paymentIntent.id} has mismatched amount (${amount}) for transactionType (${transactionType}). FULFILLMENT REJECTED.`);
    return;
  }

  // Parse legacy purchasedItems if present, or reconstruct based on transactionType for the DB
  let purchasedItems: string[] = [];
  try {
    if (paymentIntent.metadata?.purchasedItems) {
      purchasedItems = JSON.parse(paymentIntent.metadata.purchasedItems);
    } else {
      if (transactionType === "framework") purchasedItems = ["framework"];
      if (transactionType === "framework_sop") purchasedItems = ["framework", "order_bump"];
      if (transactionType === "upsell57") purchasedItems = ["upsell"];
    }
  } catch { }

  // 1. Upsert user in DB and record this intent idempotently
  await connectDB();
  
  const existingUser = await User.findOne({ processedIntents: paymentIntent.id });
  if (existingUser) {
    console.log(`[Fulfillment] PaymentIntent ${paymentIntent.id} was already processed. Skipping duplicate fulfillment.`);
    return existingUser;
  }

  const userDoc = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name,
        phone,
        email,
        isPaid: true,
      },
      $addToSet: {
        purchasedItems: { $each: purchasedItems },
        processedIntents: paymentIntent.id // Track to avoid processing the same intent twice
      },
      $setOnInsert: {
        registeredAt: new Date(),
        sentEmails: [],
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  if (!userDoc) {
    console.error(`[Fulfillment] Failed to upsert user ${email} in DB.`);
    return;
  }

  // 2. Determine the exact email to send
  const emailData = getEmailForTransactionType(transactionType);

  if (!emailData) {
    console.error(`[Fulfillment] No email template found for transactionType: ${transactionType}.`);
    return;
  }

  // 3. Send email if not already sent (Idempotent)
  if (!userDoc.sentEmails.includes(emailData.id)) {
    try {
      console.log(`[Fulfillment] Sending email ${emailData.id} to ${userDoc.email}...`);
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userDoc.email,
        subject: emailData.subject,
        html: emailData.html,
      });
      
      // Record that we sent this email
      userDoc.sentEmails.push(emailData.id);
      userDoc.lastSentAt = new Date();
      await userDoc.save();
      console.log(`[Fulfillment] Successfully sent email ${emailData.id} to ${userDoc.email}.`);
    } catch (emailErr) {
      console.error(`[Fulfillment] Failed to send email ${emailData.id} to ${userDoc.email}:`, emailErr);
    }
  } else {
    console.log(`[Fulfillment] Email ${emailData.id} already sent to ${userDoc.email}. Skipping.`);
  }

  return userDoc;
}
