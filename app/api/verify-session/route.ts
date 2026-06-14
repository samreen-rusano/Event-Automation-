import Stripe from "stripe";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function GET(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    const name = session.metadata?.name || "";
    const phone = session.metadata?.phone || "";
    const email = session.customer_email || "";
    const amount = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : "$97.00";

    // Upsert user in DB and mark as paid
    await connectDB();
    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          phone,
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

    return NextResponse.json({
      name,
      email,
      phone,
      amount,
      transactionId: session.payment_intent as string,
      paymentStatus: session.payment_status,
    });
  } catch (err: any) {
    console.error("[Stripe] verify-session error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
