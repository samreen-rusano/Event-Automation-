import Stripe from "stripe";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { transporter } from "@/lib/mailer";
import { getEmailForTransaction } from "@/lib/emailTemplate";

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const { payment_intent_id } = await req.json();

    if (!payment_intent_id) {
      return NextResponse.json({ error: "Missing payment_intent_id" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    const name = paymentIntent.metadata?.name || "";
    const phone = paymentIntent.metadata?.phone || "";
    const email = paymentIntent.receipt_email || paymentIntent.metadata?.email || "";
    const amount = `$${(paymentIntent.amount / 100).toFixed(2)}`;
    
    let purchasedItems: string[] = [];
    try {
      if (paymentIntent.metadata?.purchasedItems) {
        purchasedItems = JSON.parse(paymentIntent.metadata.purchasedItems);
      }
    } catch { }

    const isUpsell = paymentIntent.metadata?.isUpsell === "true";

    // Upsert user in DB and mark as paid
    await connectDB();
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
          processedIntents: payment_intent_id // Track to avoid processing the same intent twice
        },
        $setOnInsert: {
          registeredAt: new Date(),
          sentEmails: [],
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    // Determine the email to send based on what was purchased in THIS specific transaction
    const emailData = getEmailForTransaction(purchasedItems, isUpsell);

    // Check if we've already sent THIS specific email to THIS user
    // This allows them to receive Email 1 then Email 3 separately, but not Email 1 twice.
    if (userDoc && emailData && !userDoc.sentEmails.includes(emailData.id)) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: userDoc.email,
          subject: emailData.subject,
          html: emailData.html,
        });
        
        userDoc.sentEmails.push(emailData.id);
        userDoc.lastSentAt = new Date();
        await userDoc.save();
      } catch (emailErr) {
        console.error("Failed to send welcome email:", emailErr);
      }
    }

    return NextResponse.json({
      name,
      email,
      phone,
      amount,
      purchasedItems,
      transactionId: paymentIntent.id,
      paymentStatus: paymentIntent.status,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[Stripe] verify-payment error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
