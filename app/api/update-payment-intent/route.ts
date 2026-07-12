import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const { paymentIntentId, name, email, phone } = await req.json();

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Missing paymentIntentId" }, { status: 400 });
    }

    await stripe.paymentIntents.update(paymentIntentId, {
      ...(email && { receipt_email: email }),
      metadata: {
        name: name || "",
        email: email || "",
        phone: phone || "",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Stripe] update-payment-intent error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
