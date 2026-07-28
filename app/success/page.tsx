"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, Mail, AlertCircle, MessageCircle } from "lucide-react";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const originalIntent = searchParams.get("original_intent");
  const paymentIntent = searchParams.get("payment_intent");
  
  // Either intent parameter indicates a purchase.
  const intentId = paymentIntent || originalIntent;
  
  const [loading, setLoading] = useState(true);
  const [purchaseData, setPurchaseData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!intentId) {
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payment_intent_id: intentId }),
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || "Verification failed");
        
        setPurchaseData(data);
      } catch (err: any) {
        console.error(err);
        setError("We couldn't load your order details, but your payment was successful. Please check your email.");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [intentId]);

  if (!intentId) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">No Order Found</h1>
        <button onClick={() => router.replace("/")} className="text-[#FF6B00] hover:underline">Go to Home</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="w-12 h-12 text-[#FFB800] animate-spin" />
        <p className="text-gray-400 font-bold tracking-widest uppercase animate-pulse">Finalizing Your Order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight">Order Confirmed</h1>
          <p className="text-gray-400 text-lg md:text-xl">Thanks for your purchase!</p>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10 mb-8 space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
              <Mail className="text-[#FFB800]" />
              Check Your Inbox
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We've just sent you an email with your access links. Please check your inbox (and spam/promotions folders just in case) for access to the One Viral Ad Framework.
            </p>
          </div>

          <div className="w-full h-px bg-white/10"></div>

          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
              <MessageCircle className="text-[#00A36C]" />
              Slack Channel Access
            </h2>
            <p className="text-gray-300 leading-relaxed">
              If your purchase included the 7-Day Build Your Viral Ad Program, we will be adding you to our Slack workspace using the email address you provided. Your 7-day challenge will begin once you've been added and we've exchanged greetings.
            </p>
          </div>

          <div className="w-full h-px bg-white/10"></div>

          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
              <AlertCircle className="text-gray-400" />
              Need Support?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Please email us at <a href="mailto:yasirsultan1992@gmail.com" className="text-[#FFB800] font-bold hover:underline">yasirsultan1992@gmail.com</a> for any questions and we will get back to you within 24 hours.
            </p>
          </div>
        </div>

        {error && (
          <p className="text-center text-gray-500 italic mb-8">{error}</p>
        )}

        <div className="text-center">
          <button
            onClick={() => window.location.href = "https://rapidscaleframework.com/"} // or back to "/"
            className="px-8 py-3 bg-white text-black font-black uppercase rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#FFB800] animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
