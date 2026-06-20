import Stripe from "stripe";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { transporter } from "@/lib/mailer";
import { getPendingEmail } from "@/lib/emailTemplate";
import { EVENT_DATE } from "@/lib/config";

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
    const userDoc = await User.findOneAndUpdate(
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

    // Send immediate welcome email if not already sent
    if (userDoc && !userDoc.sentEmails.includes("immediate_welcome")) {
      const diffTime = EVENT_DATE.getTime() - new Date().getTime();
      const hoursLeft = diffTime / (1000 * 60 * 60);
      const firstName = userDoc.name ? userDoc.name.split(" ")[0] : "there";
      
      const emailObj = getPendingEmail(userDoc.sentEmails || [], hoursLeft, firstName);
      
      if (emailObj && emailObj.id === "immediate_welcome") {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userDoc.email,
            subject: emailObj.subject,
            html: emailObj.html,
          });
          
          userDoc.sentEmails.push(emailObj.id);
          userDoc.lastSentAt = new Date();
          await userDoc.save();
        } catch (emailErr) {
          console.error("Failed to send welcome email:", emailErr);
        }
      }
    }

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
