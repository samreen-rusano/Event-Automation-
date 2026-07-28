"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function UpsellContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const originalPaymentIntentId = searchParams.get("payment_intent");
  
  const [loading, setLoading] = useState(false);

  // Initialize upsell payment intent when they decide to buy
  const handleAcceptUpsell = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-upsell-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalPaymentIntentId }),
      });
      const data = await res.json();
      
      if (data.success && data.paymentIntentId) {
        // Direct to success page with both intents
        router.push(`/success?original_intent=${originalPaymentIntentId}&payment_intent=${data.paymentIntentId}`);
      } else {
        throw new Error(data.error || "Could not process upsell payment");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineUpsell = () => {
    // If declined, redirect to success page with original payment intent
    router.push(`/success?payment_intent=${originalPaymentIntentId}`);
  };

  if (!originalPaymentIntentId) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Access</h1>
        <p className="text-gray-400 mb-8">No purchase found.</p>
        <button onClick={() => router.push("/")} className="text-[#FF6B00] hover:underline">Return to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🎉</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">Thank You for Your Purchase!</h1>
          <p className="text-gray-400 text-lg">Your order is confirmed, but wait...</p>
        </div>

        <div className="w-full h-px bg-white/10 mb-12"></div>

        <div className="bg-[#0e0e0e] border border-[#FFB800]/30 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(255,184,0,0.1)] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#FFB800]"></div>
          
          <h2 className="text-[#FFB800] font-black tracking-widest uppercase text-sm md:text-base mb-4">One-Time Offer</h2>
          <h3 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
            Want to Build Your One Viral Ad With Us in just 7 days?
          </h3>
          
          <div className="text-2xl md:text-3xl font-bold text-white mb-10">
            Only $57
          </div>

          <div className="text-left max-w-xl mx-auto space-y-10 mb-12 text-gray-300 text-lg leading-relaxed">
            <div>
              <h4 className="text-white font-bold text-xl mb-4">Objective</h4>
              <p>In just 7 days, you'll have:</p>
              <ul className="list-disc pl-5 space-y-2 mt-4 text-gray-400">
                <li>A clear, irresistible offer.</li>
                <li>7 versions of your first viral ad.</li>
                <li>A high-converting product page script.</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-xl mb-4">What It Includes</h4>
              <p className="text-gray-400">
                7 days of private Slack access, where you can ask questions, receive personalized feedback, and get guidance from us as you build your One Viral Ad.
              </p>
            </div>
          </div>

          <div className="space-y-6 max-w-xl mx-auto">
            <button
              onClick={handleAcceptUpsell}
              disabled={loading}
              className="w-full bg-[#00A36C] hover:bg-[#008A5B] text-white font-black py-5 rounded-xl uppercase tracking-wider text-lg transition-all shadow-[0_4px_20px_rgba(0,163,108,0.3)] hover:shadow-[0_4px_30px_rgba(0,163,108,0.5)] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "YES, ADD TO MY ORDER FOR $57"}
            </button>
            <p className="text-xs text-gray-500 mt-2">1-Click Purchase: Your card ending in the previously used number will be charged $57.</p>
            
            <button
              onClick={handleDeclineUpsell}
              disabled={loading}
              className="text-gray-500 hover:text-gray-300 underline font-medium text-sm md:text-base transition-colors"
            >
              No thanks, I don't want personalized guidance.
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function UpsellPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#FFB800] animate-spin" /></div>}>
      <UpsellContent />
    </Suspense>
  );
}
