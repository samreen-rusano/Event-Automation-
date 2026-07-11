import Stripe from "stripe";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { transporter } from "@/lib/mailer";
import { getPendingEmail } from "@/lib/emailTemplate";

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
    const website = paymentIntent.metadata?.website || "";
    const email = paymentIntent.receipt_email || paymentIntent.metadata?.email || "";
    const amount = `$${(paymentIntent.amount / 100).toFixed(2)}`;

    // Upsert user in DB and mark as paid
    await connectDB();
    const userDoc = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          phone,
          website,
          email,
          isPaid: true,
        },
        $setOnInsert: {
          registeredAt: new Date(),
          sentEmails: [],
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    // Send immediate welcome email if not already sent
    if (userDoc && !userDoc.sentEmails.includes("immediate_welcome")) {
      const firstName = userDoc.name ? userDoc.name.split(" ")[0] : "there";
      const emailObj = getPendingEmail(userDoc.sentEmails || [], 0, firstName);
      
      if (emailObj && emailObj.id === "immediate_welcome") {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userDoc.email,
            subject: emailObj.subject,
            html: emailObj.html,
          });
          
          userDoc.sentEmails.push(emailObj.id);
          userDoc.lastSentAt = new Date();
          await userDoc.save();
        } catch (emailErr) {
          console.error("Failed to send welcome email:", emailErr);
        }
      }
    }

    return NextResponse.json({
      name,
      email,
      phone,
      amount,
      transactionId: paymentIntent.id,
      paymentStatus: paymentIntent.status,
    });
  } catch (err: any) {
    console.error("[Stripe] verify-payment error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
