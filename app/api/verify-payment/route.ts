import Stripe from "stripe";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { transporter } from "@/lib/mailer";
import { getEmailForPurchase } from "@/lib/emailTemplate";

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
        // We can optionally add purchasedItems to the user document
        $addToSet: {
          purchasedItems: { $each: purchasedItems }
        },
        $setOnInsert: {
          registeredAt: new Date(),
          sentEmails: [],
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    // Determine the email to send based on ALL purchased items for this user
    // (Combining what they just bought with anything they bought previously in this session)
    const allPurchasedItems = userDoc.purchasedItems || [];
    
    const emailData = getEmailForPurchase(allPurchasedItems, userDoc.name ? userDoc.name.split(" ")[0] : "there");

    // Check if we've already sent an email. 
    // If they already got email1, and now they deserve email3, we shouldn't send email3 if "Do not send multiple emails" is strict.
    // Wait, if we wait until the Thank You page, they will only trigger verify-payment ONCE for the final outcome.
    // Let's just check if THIS specific email has been sent.
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
      purchasedItems: allPurchasedItems,
      transactionId: paymentIntent.id,
      paymentStatus: paymentIntent.status,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[Stripe] verify-payment error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
