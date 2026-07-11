import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const { name, email, phone, website } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 495, // $4.95
      currency: "usd",
      receipt_email: email,
      metadata: {
        name: name,
        email: email,
        phone: phone || "",
        website: website || "",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error("[Stripe] create-payment-intent error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
