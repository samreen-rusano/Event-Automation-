import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
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
        transactionType: hasOrderBump ? "framework_sop" : "framework",
        orderBump: hasOrderBump ? "true" : "false",
      },
      payment_method_types: ["card"],
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[Stripe] create-payment-intent error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
