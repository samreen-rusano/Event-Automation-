"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ShoppingCart, Mail, Phone, Globe, User, Loader2, CheckCircle, ShieldCheck } from "lucide-react";
import { fbEvent } from "@/components/FacebookPixel";
import { readSessionStorage, writeSessionStorage } from "@/lib/browser";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentModal from '@/components/PaymentModal';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function LandingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const paymentIntentParam = searchParams.get("payment_intent");

  // Form & checkout state
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Payment confirmation state
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentError, setPaymentError] = useState("");

  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Track landing page intent once per browser tab session
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = "fb_viewcontent_preorder";
    if (readSessionStorage(key)) return;

    fbEvent("ViewContent", {
      content_name: "One Viral Ad Framework Preorder Landing",
      content_category: "Framework",
    });
    writeSessionStorage(key, "1");
  }, []);

  // Preload PaymentIntent on mount
  useEffect(() => {
    const initStripe = async () => {
      try {
        const res = await fetch("/api/create-payment-intent", { method: "POST", body: "{}" });
        const data = await res.json();
        if (data.clientSecret && data.paymentIntentId) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
        }
      } catch (err) {
        console.error("Failed to preload payment intent:", err);
      }
    };
    initStripe();
  }, []);

  // Verify payment if session_id or payment_intent is in query params
  useEffect(() => {
    if (!sessionId && !paymentIntentParam) return;

    const verify = async () => {
      setVerifyingPayment(true);
      try {
        let res;
        if (paymentIntentParam) {
          res = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ payment_intent_id: paymentIntentParam }),
          });
        } else {
          res = await fetch(`/api/verify-session?session_id=${sessionId}`);
        }
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Verification failed.");
        
        setPaymentData(data);
        setPaymentSuccess(true);

        // Fire Purchase event
        if (typeof window !== "undefined") {
          const purchaseKey = `fb_purchase_${sessionId}`;
          if (!window.sessionStorage.getItem(purchaseKey)) {
            fbEvent("Purchase", {
              value: 4.95,
              currency: "USD",
              content_name: "The One Viral Ad Framework",
              transaction_id: data.transactionId,
            });
            window.sessionStorage.setItem(purchaseKey, "1");
          }
        }
      } catch (err: any) {
        setPaymentError(err.message || "Something went wrong verifying your payment.");
      } finally {
        setVerifyingPayment(false);
      }
    };

    verify();
  }, [sessionId]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setCheckoutError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setCheckoutError("Please enter a valid email address.");
      return;
    }

    setCheckoutError("");
    setLoading(true);

    try {
      fbEvent("InitiateCheckout", {
        value: 4.95,
        currency: "USD",
        content_name: "The One Viral Ad Framework",
      });

      if (!paymentIntentId) {
        throw new Error("Payment is still initializing. Please try again in a few seconds.");
      }

      const res = await fetch("/api/update-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId, ...formData }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not prepare payment.");
      }

      setIsPaymentModalOpen(true);
      setLoading(false);
    } catch (err: any) {
      setCheckoutError(err.message || "An error occurred during payment initialization.");
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setIsPaymentModalOpen(false);
    setVerifyingPayment(true);
    try {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_intent_id: paymentIntentId }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Verification failed.");
      
      setPaymentData(data);
      setPaymentSuccess(true);

      // Fire Purchase event
      if (typeof window !== "undefined") {
        const purchaseKey = `fb_purchase_${paymentIntentId}`;
        if (!window.sessionStorage.getItem(purchaseKey)) {
          fbEvent("Purchase", {
            value: 4.95,
            currency: "USD",
            content_name: "The One Viral Ad Framework",
            transaction_id: paymentIntentId,
          });
          window.sessionStorage.setItem(purchaseKey, "1");
        }
      }
    } catch (err: any) {
      setPaymentError(err.message || "Something went wrong verifying your payment.");
    } finally {
      setVerifyingPayment(false);
    }
  };

  // If verifying payment, show a beautiful loader
  if (verifyingPayment) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="w-12 h-12 text-[#FF6B00] animate-spin" />
        <p className="text-gray-400 text-sm md:text-base font-bold tracking-wide animate-pulse">
          CONFIRMING YOUR PAYMENT...
        </p>
      </div>
    );
  }

  // If payment succeeded, show the thank you screen on the same page
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6 md:p-8 font-sans selection:bg-[#FF6B00] selection:text-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xl bg-[#111] rounded-3xl border border-[#FF6B00]/40 p-8 md:p-10 shadow-[0_0_50px_rgba(255,107,0,0.15)] flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.15)] animate-bounce">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>

            <div className="bg-[#FF6B00] text-black font-extrabold text-[12px] md:text-[14px] px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
              PAYMENT SUCCESSFUL
            </div>

            <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
              THANK YOU FOR YOUR ORDER!
            </h1>

            <div className="space-y-4 text-gray-300 text-[15px] md:text-[17px] leading-relaxed font-medium mb-8">
              <p>
                The <strong className="text-white">One Viral Ad Framework</strong> will be delivered to your inbox within the next 14 days.
              </p>
              <p className="text-[14px] md:text-[15px] text-gray-400 border-t border-white/10 pt-4 mt-4">
                If you have any questions, please email <a href="mailto:yasirsultan1992@gmail.com" className="text-[#FF6B00] font-bold hover:underline">yasirsultan1992@gmail.com</a>, and I'll get back to you within 24 hours.
              </p>
            </div>

            <button
              onClick={() => router.replace("/")}
              className="px-8 py-3.5 bg-white text-black hover:bg-gray-200 transition-all font-black text-sm uppercase rounded-xl tracking-wider cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Disclaimer in success page bottom */}
        <div className="text-center mt-6">
          <p className="text-[10px] md:text-[12px] text-gray-600 max-w-xl mx-auto leading-relaxed">
            Disclaimer: The results expressed in this training are illustrative and not guaranteed. Your success is entirely up to you and the work you put in.
          </p>
        </div>
      </div>
    );
  }

  // If payment verification errored
  if (paymentError) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 border-2 border-red-500/40 rounded-full flex items-center justify-center mb-6">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black mb-3">Verification Failed</h1>
        <p className="text-gray-400 max-w-md text-[14px] mb-8">{paymentError}</p>
        <button
          onClick={() => router.replace("/")}
          className="px-6 py-3 bg-[#FF6B00] text-black font-bold uppercase rounded-lg hover:bg-[#e05a00] transition-colors cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF6B00] selection:text-white lg:h-screen lg:max-h-screen lg:overflow-hidden flex flex-col justify-between p-4 sm:p-6 lg:py-4 lg:px-8">
      
      {/* Container wrapper for scrolling on mobile & alignment on desktop */}
      <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
        
        {/* 1. HEADLINE ZONE */}
        <div className="text-center flex flex-col items-center mt-2 sm:mt-4 lg:mt-2 mb-4 lg:mb-4">
          <div className="flex items-center gap-3 mb-2 text-[#FF2E2E] font-black text-2xl sm:text-3xl md:text-4xl tracking-widest uppercase">
            <span>\</span>
            <span className="text-white">DISCOVER HOW</span>
            <span>/</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[40px] xl:text-[46px] font-black leading-[1.08] tracking-tight uppercase mb-3 flex flex-col">
            <span className="text-[#FFB800] drop-shadow-[0_4px_12px_rgba(255,184,0,0.15)]">STREETWEAR BRAND OWNERS</span>
            <span className="text-white mt-0.5">CAN <span className="text-[#FF2E2E]">SELL OUT</span> THEIR NEXT DROP</span>
          </h1>

          {/* Yellow Brush stroke wrapper */}
          <div className="inline-block bg-[#FFB800] text-black px-5 py-1.5 sm:py-2.5 font-black text-xl sm:text-3xl lg:text-2xl xl:text-3xl uppercase rounded-lg shadow-lg mb-4 rotate-[-1deg] transform hover:scale-[1.02] transition-transform">
            IN 30 DAYS
          </div>

          {/* White Border text */}
          <div className="border border-white/40 rounded-full px-10 py-3 sm:py-3.5 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide bg-white/5 mt-2">
            WITH JUST <span className="text-[#FF2E2E] font-black">ONE VIRAL AD</span>
          </div>
        </div>

        {/* 3. PRE-ORDER ACTION CARD */}
        <div className="bg-[#0e0e0e] border border-[#FF6B00]/40 rounded-3xl p-5 sm:p-7 text-center shadow-[0_0_30px_rgba(255,107,0,0.1)] hover:border-[#FF6B00] transition-colors duration-300 max-w-md mx-auto w-full mb-4">
          <h2 className="text-sm sm:text-base font-black tracking-wider uppercase mb-1">
            PRE-ORDER THE <span className="text-[#FF2E2E]">ONE VIRAL AD FRAMEWORK</span>
          </h2>
          <div className="text-xl sm:text-2xl font-black text-[#FFB800] mb-6 tracking-wide drop-shadow-sm">
            FOR JUST $4.95
          </div>

          {checkoutError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-3.5 rounded-xl text-center mb-4 leading-tight">
              {checkoutError}
            </div>
          )}

          <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-left">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              <input
                required
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border border-gray-300 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00] rounded-xl py-3 pl-11 pr-4 text-black placeholder:text-gray-500 font-medium text-sm outline-none transition-all shadow-sm"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              <input
                required
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white border border-gray-300 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00] rounded-xl py-3 pl-11 pr-4 text-black placeholder:text-gray-500 font-medium text-sm outline-none transition-all shadow-sm"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              <input
                required
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white border border-gray-300 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00] rounded-xl py-3 pl-11 pr-4 text-black placeholder:text-gray-500 font-medium text-sm outline-none transition-all shadow-sm"
              />
            </div>

            {/* Submit / Proceed */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00A36C] hover:bg-[#008A5B] text-white font-black py-3.5 rounded-xl uppercase tracking-wider text-sm transition-colors cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2 mt-2 shadow-[0_4px_20px_rgba(0,163,108,0.3)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>GO TO STEP 2</span>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              <span>Secure 256-bit Stripe checkout</span>
            </div>
          </form>
        </div>

      </div>

      {/* 4. DISCLAIMER FOOTER ZONE */}
      <div className="text-center mt-auto py-1">
        <p className="text-[10px] sm:text-[11px] text-gray-600 max-w-xl mx-auto leading-relaxed">
          Disclaimer: The results expressed in this training are illustrative and not guaranteed. Your success is entirely up to you and the work you put in.
        </p>
      </div>

      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#FF6B00',
                colorBackground: '#ffffff',
                colorText: '#000000',
                colorDanger: '#df1b41',
                fontFamily: 'system-ui, sans-serif',
                borderRadius: '12px',
                spacingUnit: '4px',
              },
              rules: {
                '.Input': {
                  border: '1px solid #d1d5db',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }
              }
            }
          }}
        >
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onSuccess={handlePaymentSuccess}
            customerDetails={formData}
          />
        </Elements>
      )}

    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin" />
      </div>
    }>
      <LandingPageContent />
    </Suspense>
  );
}
