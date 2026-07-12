"use client";

import React, { useState } from "react";
import { X, Loader2, ShieldCheck } from "lucide-react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentIntentId: string) => void;
  customerDetails: { name: string; email: string; phone: string; };
}

export default function PaymentModal({ isOpen, onClose, onSuccess, customerDetails }: PaymentModalProps) {
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
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 transition-all duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className={`relative w-full max-w-md bg-[#0e0e0e] border border-[#FF6B00]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(255,107,0,0.2)] flex flex-col max-h-[90vh] overflow-y-auto transition-transform duration-300 ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 mt-2">
          <h3 className="text-2xl sm:text-3xl font-black uppercase text-white leading-tight">
            COMPLETE ORDER – $4.95
          </h3>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-3.5 rounded-xl text-center mb-4 leading-tight">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl overflow-hidden">
            <PaymentElement options={{ 
              layout: 'accordion',
              defaultValues: {
                billingDetails: {
                  name: customerDetails.name,
                  email: customerDetails.email,
                  phone: customerDetails.phone,
                }
              }
            }} />
          </div>

          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-[#FF6B00] hover:bg-[#E05A00] text-white font-black py-4 rounded-xl uppercase tracking-wider text-base transition-colors cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>PROCESSING...</span>
              </>
            ) : (
              <span>PURCHASE</span>
            )}
          </button>
          
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-gray-400" />
            <span>Secure Checkout Powered by Stripe</span>
          </div>
        </form>
      </div>
    </div>
  );
}
