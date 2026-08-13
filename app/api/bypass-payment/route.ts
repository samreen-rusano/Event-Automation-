import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    if (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ENABLE_PAYMENT_BYPASS !== "true") {
      return NextResponse.json({ error: "Forbidden in production" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, phone, orderBump } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email required" }, { status: 400 });
    }

    const purchasedItems = ["framework"];
    if (orderBump) purchasedItems.push("order_bump");

    const transactionId = `simulated_${Date.now()}`;

    await connectDB();
    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          phone,
          email,
          isPaid: true,
          paymentStatus: "simulated",
          isTestBypass: true,
        },
        $addToSet: {
          purchasedItems: { $each: purchasedItems },
          processedIntents: transactionId,
        },
        $setOnInsert: {
          registeredAt: new Date(),
          sentEmails: [],
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json({ 
      success: true,
      transactionId
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[Bypass] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
