"use client";

import React, { useState } from "react";
import { X, Loader2, ShieldCheck } from "lucide-react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

interface PaymentModalProps {
  onClose: () => void;
  onSuccess: (paymentIntentId: string) => void;
}

export default function PaymentModal({ onClose, onSuccess }: PaymentModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href, // Safe fallback
      },
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message || "An unexpected error occurred.");
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    } else {
      setError("Payment failed or requires additional action.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-250">
      <div className="relative w-full max-w-md bg-[#0e0e0e] border border-[#FF6B00]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(255,107,0,0.2)] flex flex-col max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 mt-2">
          <h3 className="text-xl sm:text-2xl font-black uppercase text-white leading-tight">
            Complete Payment
          </h3>
          <p className="text-gray-400 text-xs mt-1.5">
            Enter your card details securely below.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-3.5 rounded-xl text-center mb-4 leading-tight">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-1 rounded-xl">
            <PaymentElement options={{ 
              layout: 'tabs'
            }} />
          </div>

          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-[#FF6B00] hover:bg-[#E05A00] text-black font-black py-3.5 rounded-xl uppercase tracking-wider text-sm transition-colors cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2 mt-2 shadow-[0_4px_20px_rgba(255,107,0,0.3)]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Pay $4.95 Now</span>
            )}
          </button>
          
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
            <span>Secure 256-bit Stripe checkout</span>
          </div>
        </form>
      </div>
    </div>
  );
}
