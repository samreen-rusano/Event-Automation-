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

    // Use shared fulfillment logic as a fallback to ensure immediate fulfillment during standard redirect flow
    const { fulfillPurchase } = await import("@/lib/fulfillment");
    await fulfillPurchase(paymentIntent);

    return NextResponse.json({
      name: paymentIntent.metadata?.name || "",
      email: paymentIntent.receipt_email || paymentIntent.metadata?.email || "",
      phone: paymentIntent.metadata?.phone || "",
      amount: `$${(paymentIntent.amount / 100).toFixed(2)}`,
      transactionId: paymentIntent.id,
      paymentStatus: paymentIntent.status,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[Stripe] verify-payment error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
