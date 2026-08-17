const Stripe = require('stripe');

const stripe = new Stripe('sk_test_123');
const secret = 'whsec_dummy123';

async function sendTestEvent(transactionType, expectedPrice) {
    const payload = {
        id: `evt_test_${Date.now()}`,
        type: 'payment_intent.succeeded',
        data: {
            object: {
                id: `pi_test_${Date.now()}`,
                object: 'payment_intent',
                amount: expectedPrice,
                currency: 'usd',
                status: 'succeeded',
                receipt_email: `test_${Date.now()}@example.com`,
                metadata: {
                    name: "Test User",
                    transactionType: transactionType
                }
            }
        }
    };

    const payloadString = JSON.stringify(payload);
    const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret,
    });

    console.log(`Sending webhook for ${transactionType}...`);
    const res = await fetch('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'stripe-signature': header
        },
        body: payloadString
    });

    const text = await res.text();
    console.log(`Response (${res.status}): ${text}`);
    return payloadString; // For replaying
}

async function main() {
    console.log("=== Testing $17 Webhook (framework) ===");
    await sendTestEvent('framework', 1700);

    console.log("\n=== Testing $44 Webhook (framework_sop) ===");
    await sendTestEvent('framework_sop', 4400);

    console.log("\n=== Testing $57 Webhook (upsell57) ===");
    const upsellPayload = await sendTestEvent('upsell57', 5700);

    console.log("\n=== Testing Replay/Duplicate Protection ===");
    const header = stripe.webhooks.generateTestHeaderString({
        payload: upsellPayload,
        secret,
    });
    const res = await fetch('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'stripe-signature': header },
        body: upsellPayload
    });
    console.log(`Replay Response (${res.status}): ${await res.text()}`);
}

main().catch(console.error);
