import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const body = await req.text();
    const data = body ? JSON.parse(body) : {};

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 495, // $4.95
      currency: "usd",
      ...(data.email && { receipt_email: data.email }),
      metadata: {
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
      },
      payment_method_types: ["card"],
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    });
  } catch (err: any) {
    console.error("[Stripe] create-payment-intent error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
