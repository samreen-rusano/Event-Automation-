import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { paymentIntentId, name, email, phone, orderBump } = await req.json();

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Missing paymentIntentId" }, { status: 400 });
    }

    const hasOrderBump = orderBump === true;
    const amount = hasOrderBump ? 4400 : 1700; // $44.00 or $17.00

    const purchasedItems = ["framework"];
    if (hasOrderBump) purchasedItems.push("order_bump");

    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.customer) {
      await stripe.customers.update(intent.customer as string, {
        name: name || "",
        email: email || "",
        phone: phone || "",
      });
    }

    await stripe.paymentIntents.update(paymentIntentId, {
      amount,
      ...(email && { receipt_email: email }),
      metadata: {
        name: name || "",
        email: email || "",
        phone: phone || "",
        purchasedItems: JSON.stringify(purchasedItems),
        transactionType: hasOrderBump ? "framework_sop" : "framework",
        orderBump: hasOrderBump ? "true" : "false",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[Stripe] update-payment-intent error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
