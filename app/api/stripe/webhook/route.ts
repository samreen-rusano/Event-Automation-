import Stripe from "stripe";
import { NextResponse } from "next/server";
import { fulfillPurchase } from "@/lib/fulfillment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    if (!endpointSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    }
    
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`[Webhook] Signature verification failed.`, error.message);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
      console.log(`[Webhook] PaymentIntent was successful: ${paymentIntentSucceeded.id}`);
      
      try {
        await fulfillPurchase(paymentIntentSucceeded);
      } catch (fulfillErr) {
        console.error(`[Webhook] Error fulfilling purchase:`, fulfillErr);
        // Do not return 500 if fulfillment internally fails, to prevent Stripe from retrying forever
        // if it's a fatal application logic bug. However, if it's a DB connection error, we might want to retry.
        // For now, we rely on the idempotency of the fulfillment logic.
        return NextResponse.json({ error: "Fulfillment error" }, { status: 500 });
      }
      break;
      
    case "payment_intent.payment_failed":
      const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
      console.error(`[Webhook] Payment failed for intent: ${paymentIntentFailed.id}`);
      // Do not fulfill, just log
      break;
      
    default:
      console.log(`[Webhook] Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
