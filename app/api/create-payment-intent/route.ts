import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const body = await req.text();
    const data = body ? JSON.parse(body) : {};

    const hasOrderBump = data.orderBump === true;
    const amount = hasOrderBump ? 4400 : 1700; // $44.00 or $17.00

    const purchasedItems = ["framework"];
    if (hasOrderBump) purchasedItems.push("order_bump");

    const customer = await stripe.customers.create();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      customer: customer.id,
      setup_future_usage: "off_session",
      ...(data.email && { receipt_email: data.email }),
      metadata: {
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        purchasedItems: JSON.stringify(purchasedItems),
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
