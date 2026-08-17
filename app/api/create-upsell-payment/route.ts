import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { originalPaymentIntentId } = await req.json();

    if (!originalPaymentIntentId) {
      return NextResponse.json({ error: "Missing originalPaymentIntentId" }, { status: 400 });
    }

    if (originalPaymentIntentId.startsWith("simulated_")) {
      if (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ENABLE_PAYMENT_BYPASS !== "true") {
        return NextResponse.json({ error: "Bypass disabled" }, { status: 403 });
      }

      // Record upsell for bypass user
      const { connectDB } = await import("@/lib/db");
      const User = (await import("@/models/user")).default;
      
      await connectDB();
      await User.findOneAndUpdate(
        { processedIntents: originalPaymentIntentId },
        { 
          $addToSet: { purchasedItems: "upsell" },
          $set: { paymentStatus: "simulated_upsell" }
        }
      );

      return NextResponse.json({ 
        success: true,
        paymentIntentId: `simulated_upsell_${Date.now()}` 
      });
    }

    const originalIntent = await stripe.paymentIntents.retrieve(originalPaymentIntentId);

    if (!originalIntent) {
      return NextResponse.json({ error: "Invalid original payment intent" }, { status: 400 });
    }

    // Only a genuinely succeeded original purchase may authorize an off-session upsell charge.
    if (originalIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Original purchase has not completed successfully" }, { status: 400 });
    }

    if (!originalIntent.customer || !originalIntent.payment_method) {
      return NextResponse.json({ error: "No saved payment method found for 1-click upsell" }, { status: 400 });
    }

    let purchasedItems = [];
    try {
      if (originalIntent.metadata && originalIntent.metadata.purchasedItems) {
        purchasedItems = JSON.parse(originalIntent.metadata.purchasedItems);
      }
    } catch {
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
        originalPaymentIntentId: originalPaymentIntentId,
        transactionType: "upsell57"
      },
    }, {
      idempotencyKey: `upsell_${originalPaymentIntentId}`
    });

    return NextResponse.json({ 
      success: true,
      paymentIntentId: paymentIntent.id 
    });
  } catch (err: unknown) {
    const stripeErr = err as Stripe.errors.StripeError;
    console.error("[Stripe] create-upsell-payment error:", stripeErr.message);

    if (stripeErr.code === "authentication_required") {
      return NextResponse.json(
        { error: "Your card requires additional authentication and couldn't be charged automatically. Please contact support." },
        { status: 402 }
      );
    }
    if (stripeErr.type === "StripeCardError") {
      return NextResponse.json(
        { error: stripeErr.message || "Your card was declined for this purchase." },
        { status: 402 }
      );
    }

    return NextResponse.json({ error: stripeErr.message || "Upsell payment failed." }, { status: 500 });
  }
}
