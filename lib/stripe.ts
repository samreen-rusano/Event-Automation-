import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY || "";
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

if (!secretKey) {
  console.warn("[Stripe Warning] STRIPE_SECRET_KEY is not defined in environment variables.");
}

if (!publishableKey) {
  console.warn("[Stripe Warning] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables.");
}

// Validate that test keys are not mixed with live keys
const isSecretLive = secretKey.startsWith("sk_live");
const isSecretTest = secretKey.startsWith("sk_test");
const isPubLive = publishableKey.startsWith("pk_live");
const isPubTest = publishableKey.startsWith("pk_test");

if ((isSecretLive && isPubTest) || (isSecretTest && isPubLive)) {
  const errorMsg = `[Stripe Error] Key mismatch detected! Secret key is ${
    isSecretLive ? "LIVE" : "TEST"
  } but Publishable key is ${isPubLive ? "LIVE" : "TEST"}. Please check your .env file.`;
  console.error(errorMsg);
  if (process.env.NODE_ENV === "production") {
    throw new Error(errorMsg);
  }
}

// Validate that the keys belong to the same Stripe Account (Section 54)
const secretAccount = secretKey.split("_")[2]?.substring(0, 8);
const pubAccount = publishableKey.split("_")[2]?.substring(0, 8);

if (secretAccount && pubAccount && secretAccount !== pubAccount) {
  const errorMsg = `[Stripe Error] Account ID mismatch! Secret Key belongs to account "${secretAccount}" but Publishable Key belongs to account "${pubAccount}". They must come from the same Stripe account!`;
  console.error(errorMsg);
  if (process.env.NODE_ENV === "production") {
    throw new Error(errorMsg);
  }
}

export const stripe = new Stripe(secretKey);
