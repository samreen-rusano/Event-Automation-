import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const { originalPaymentIntentId } = await req.json();

    if (!originalPaymentIntentId) {
      return NextResponse.json({ error: "Missing originalPaymentIntentId" }, { status: 400 });
    }

    const originalIntent = await stripe.paymentIntents.retrieve(originalPaymentIntentId);
    
    if (!originalIntent) {
      return NextResponse.json({ error: "Invalid original payment intent" }, { status: 400 });
    }

    if (!originalIntent.customer || !originalIntent.payment_method) {
      return NextResponse.json({ error: "No saved payment method found for 1-click upsell" }, { status: 400 });
    }

    let purchasedItems = [];
    try {
      if (originalIntent.metadata && originalIntent.metadata.purchasedItems) {
        purchasedItems = JSON.parse(originalIntent.metadata.purchasedItems);
      }
    } catch (e) {
      console.error("Error parsing purchasedItems from original intent metadata");
    }

    purchasedItems.push("upsell");

    // Instantly charge the saved card
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5700, // $57.00
      currency: "usd",
      customer: originalIntent.customer as string,
      payment_method: originalIntent.payment_method as string,
      off_session: true,
      confirm: true,
      receipt_email: originalIntent.receipt_email || undefined,
      metadata: {
        name: originalIntent.metadata?.name || "",
        email: originalIntent.metadata?.email || originalIntent.receipt_email || "",
        phone: originalIntent.metadata?.phone || "",
        purchasedItems: JSON.stringify(purchasedItems),
        isUpsell: "true",
        originalIntentId: originalPaymentIntentId
      },
    });

    return NextResponse.json({ 
      success: true,
      paymentIntentId: paymentIntent.id 
    });
  } catch (err: any) {
    console.error("[Stripe] create-upsell-payment error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
