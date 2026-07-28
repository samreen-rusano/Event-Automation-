"use client";

import React, { useState, useEffect } from "react";

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, ShieldCheck, Check } from "lucide-react";

interface CheckoutFormProps {
  paymentIntentId: string;
  clientSecret: string;
}

export default function CheckoutForm({ paymentIntentId, clientSecret }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();


  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [orderBump, setOrderBump] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingPrice, setUpdatingPrice] = useState(false);

  // When orderBump changes, update the payment intent
  useEffect(() => {
    const updateIntent = async () => {
      if (!paymentIntentId) return;
      setUpdatingPrice(true);
      try {
        await fetch("/api/update-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId, ...formData, orderBump }),
        });
        // Note: we don't need to re-initialize elements for amount changes, Stripe handles it
        // internally when confirmed, though ideally the elements instance should be refreshed if the amount displayed in PaymentElement changes.
        // Actually PaymentElement doesn't show the total amount, only the payment fields.
      } catch (err: unknown) {
        const error = err as Error;
        console.error("Failed to update payment intent:", error);
      } finally {
        setUpdatingPrice(false);
      }
    };
    
    // Skip initial mount if form is empty and bump is false, because we already created it.
    // Wait, on initial mount we created for $17. If orderBump changes to true, we must update.
    updateIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBump, paymentIntentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!formData.name || !formData.email) {
      setError("Please fill in your name and email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First, ensure intent is fully updated with latest customer info before confirming
      await fetch("/api/update-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId, ...formData, orderBump }),
      });

      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message || "An error occurred during submission.");
      }

      // Then confirm payment
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/upsell`,
          payment_method_data: {
            billing_details: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            }
          }
        },
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed.");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const total = orderBump ? 44 : 17;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#0e0e0e] border border-[#FF6B00]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(255,107,0,0.1)] max-w-xl mx-auto text-left w-full">
      <h2 className="text-2xl font-black text-white uppercase tracking-wider text-center mb-6">Complete Your Purchase</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold p-4 rounded-xl text-center leading-tight">
          {error}
        </div>
      )}

      {/* Customer Info Section */}
      <div className="space-y-4">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide border-b border-white/10 pb-2">1. Customer Information</h3>
        <input
          required
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-black border border-gray-700 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] rounded-xl py-3 px-4 text-white placeholder:text-gray-500 font-medium text-sm outline-none transition-all"
        />
        <input
          required
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-black border border-gray-700 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] rounded-xl py-3 px-4 text-white placeholder:text-gray-500 font-medium text-sm outline-none transition-all"
        />
        <input
          type="tel"
          placeholder="Phone Number (Optional)"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full bg-black border border-gray-700 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] rounded-xl py-3 px-4 text-white placeholder:text-gray-500 font-medium text-sm outline-none transition-all"
        />
      </div>

      {/* Payment Section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide border-b border-white/10 pb-2">2. Payment Details</h3>
        <div className="bg-white rounded-xl p-4 shadow-inner">
          <PaymentElement />
        </div>
      </div>

      {/* Order Bump */}
      <div className="pt-4">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide border-b border-white/10 pb-2 mb-4">3. Special Offer</h3>
        <div 
          onClick={() => setOrderBump(!orderBump)}
          className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all duration-300 ${orderBump ? 'bg-[#FFB800]/10 border-[#FFB800]' : 'bg-black border-gray-800 hover:border-gray-600'}`}
        >
          <div className="flex gap-4 items-start">
            <div className={`mt-1 w-6 h-6 rounded flex items-center justify-center border-2 flex-shrink-0 ${orderBump ? 'bg-[#FFB800] border-[#FFB800]' : 'border-gray-500'}`}>
              {orderBump && <Check className="w-4 h-4 text-black font-bold" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[#FF2E2E] font-black uppercase text-sm md:text-base animate-pulse">Trust Me, You Want This Too</span>
                <span className="bg-[#FFB800] text-black font-bold text-xs px-2 py-0.5 rounded-sm">FOR $27 USD</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong className="text-white">Get Started with the One Viral Ad Launch SOP:</strong> A step-by-step document that will show you how to launch, run and scale your viral Ad campaign in 30 minutes or less. This is the perfect add-on to your Framework! THIS OFFER IS NOT AVAILABLE ANYWHERE ELSE.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-black/50 p-5 rounded-xl border border-white/5 pt-4 mt-6">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide border-b border-white/10 pb-3 mb-3">Order Summary</h3>
        <div className="flex justify-between items-center text-gray-300 text-sm mb-2">
          <span>One Viral Ad Framework</span>
          <span>$17.00</span>
        </div>
        {orderBump && (
          <div className="flex justify-between items-center text-gray-300 text-sm mb-2 text-[#FFB800]">
            <span>One Viral Ad Launch SOP</span>
            <span>$27.00</span>
          </div>
        )}
        <div className="flex justify-between items-center text-white font-black text-lg md:text-xl border-t border-white/10 pt-3 mt-1">
          <span>Total</span>
          <span className="flex items-center gap-2">
            {updatingPrice && <Loader2 className="w-4 h-4 animate-spin text-[#FFB800]" />}
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading || updatingPrice}
        className="w-full bg-[#00A36C] hover:bg-[#008A5B] text-white font-black py-4 sm:py-5 rounded-xl uppercase tracking-wider text-base sm:text-lg transition-colors cursor-pointer disabled:opacity-75 flex items-center justify-center gap-3 shadow-[0_4px_25px_rgba(0,163,108,0.4)]"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 text-white animate-spin" />
            <span>Processing Order...</span>
          </>
        ) : (
          <span>COMPLETE PURCHASE FOR ${total.toFixed(2)}</span>
        )}
      </button>

      <div className="flex flex-col items-center justify-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest pt-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span>Secure 256-bit Encrypted Checkout</span>
        </div>
      </div>
    </form>
  );
}
