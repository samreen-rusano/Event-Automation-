"use client";

import React, { useState, useEffect } from "react";
import { PaymentElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { Loader2, Check } from "lucide-react";

interface CheckoutFormProps {
  paymentIntentId: string;
  clientSecret: string;
  stripePromise: any;
}

const STRIPE_APPEARANCE: any = {
  theme: 'night',
  variables: {
    colorPrimary: '#F8B001',
    colorBackground: '#000000',
    colorText: '#ffffff',
    colorDanger: '#DB0101',
    fontFamily: 'system-ui, sans-serif',
    borderRadius: '6px',
    spacingUnit: '5px',
  },
  rules: {
    '.Input': {
      border: '1px solid #353535',
      boxShadow: 'none',
      backgroundColor: '#000000'
    },
    '.Input:focus': {
      border: '1px solid #F8B001',
      boxShadow: 'none',
    }
  }
};

export default function CheckoutForm({ paymentIntentId, clientSecret, stripePromise }: CheckoutFormProps) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [orderBump, setOrderBump] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingPrice, setUpdatingPrice] = useState(false);

  // When orderBump changes, update the payment intent
  useEffect(() => {
    const updateIntent = async () => {
      if (!paymentIntentId || !clientSecret) return;
      setUpdatingPrice(true);
      try {
        await fetch("/api/update-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId, ...formData, orderBump }),
        });
      } catch (err: unknown) {
        console.error("Failed to update payment intent:", err);
      } finally {
        setUpdatingPrice(false);
      }
    };
    
    updateIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBump, paymentIntentId, clientSecret]);

  const total = orderBump ? 44 : 17;
  
  const stripeOptions = React.useMemo(() => ({
    clientSecret,
    appearance: STRIPE_APPEARANCE
  }), [clientSecret]);

  return (
    <div className="space-y-6 md:space-y-8 bg-[#000000] border border-[#353535] rounded-[10px] p-5 sm:p-8 max-w-[min(92vw,850px)] mx-auto text-left w-full text-[#E9EAEA]">
      {error && (
        <div className="bg-[#DB0101]/10 border border-[#DB0101] text-[#DB0101] text-sm font-bold p-4 rounded-md text-center leading-tight">
          {error}
        </div>
      )}

      {/* Customer Info Section - Renders Immediately */}
      <div className="space-y-4">
        <label className="block">
          <span className="block text-sm font-bold text-[#E9EAEA] mb-1.5">Name</span>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[#000000] border border-[#353535] focus:border-[#F8B001] focus:ring-1 focus:ring-[#F8B001] rounded-[6px] py-3 md:py-4 px-4 text-[#E9EAEA] placeholder:text-[#555] font-medium text-base outline-none transition-all h-[52px] md:h-[60px]"
          />
        </label>
        
        <label className="block">
          <span className="block text-sm font-bold text-[#E9EAEA] mb-1.5">Email Address</span>
          <input
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-[#000000] border border-[#353535] focus:border-[#F8B001] focus:ring-1 focus:ring-[#F8B001] rounded-[6px] py-3 md:py-4 px-4 text-[#E9EAEA] placeholder:text-[#555] font-medium text-base outline-none transition-all h-[52px] md:h-[60px]"
          />
        </label>
        
        <label className="block">
          <span className="block text-sm font-bold text-[#E9EAEA] mb-1.5">Phone Number</span>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-[#000000] border border-[#353535] focus:border-[#F8B001] focus:ring-1 focus:ring-[#F8B001] rounded-[6px] py-3 md:py-4 px-4 text-[#E9EAEA] placeholder:text-[#555] font-medium text-base outline-none transition-all h-[52px] md:h-[60px]"
          />
        </label>
      </div>

      {clientSecret ? (
        <Elements
          stripe={stripePromise}
          options={stripeOptions}
        >
          <StripePaymentSection 
            formData={formData}
            orderBump={orderBump}
            setOrderBump={setOrderBump}
            total={total}
            paymentIntentId={paymentIntentId}
            clientSecret={clientSecret}
            loading={loading}
            setLoading={setLoading}
            setError={setError}
            updatingPrice={updatingPrice}
          />
        </Elements>
      ) : (
        <CheckoutSkeleton orderBump={orderBump} setOrderBump={setOrderBump} total={total} />
      )}

    </div>
  );
}

class StripeErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#DB0101]/10 border border-[#DB0101] text-[#DB0101] text-sm md:text-base font-bold p-4 rounded-[6px] text-center">
          Secure card details could not load.<br/>Please retry or refresh the page.
        </div>
      );
    }
    return this.props.children;
  }
}

function StripePaymentSection({ 
  formData, 
  orderBump, 
  setOrderBump, 
  total, 
  paymentIntentId, 
  clientSecret, 
  loading, 
  setLoading, 
  setError, 
  updatingPrice 
}: any) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    if (!formData.name || !formData.email) {
      setError("Please fill in your name and email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await fetch("/api/update-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId, ...formData, orderBump }),
      });

      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message || "An error occurred during submission.");
      }

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

  return (
    <>
      <div className="space-y-4">
        <span className="block text-sm font-bold text-[#E9EAEA] mb-1.5">Card Details</span>
        <div className="bg-[#000000] border border-[#353535] rounded-[6px] p-4 min-h-[52px] md:min-h-[60px]">
          <StripeErrorBoundary>
            <PaymentElement />
          </StripeErrorBoundary>
        </div>
      </div>

      <OrderBumpSection orderBump={orderBump} setOrderBump={setOrderBump} />
      <OrderSummary orderBump={orderBump} total={total} updatingPrice={updatingPrice} />

      <button
        onClick={handleSubmit}
        disabled={!stripe || loading || updatingPrice}
        className="w-full bg-[#006E27] hover:bg-[#007C2C] text-[#FFFFFF] font-bold py-4 md:py-5 rounded-[8px] md:rounded-[10px] uppercase text-lg md:text-xl transition-colors cursor-pointer disabled:opacity-75 flex items-center justify-center gap-3 border-none min-h-[64px]"
      >
        {loading ? (
          <>
            <Loader2 className="w-6 h-6 text-white animate-spin" />
            <span>PROCESSING...</span>
          </>
        ) : (
          <span>COMPLETE ORDER FOR ${total.toFixed(2)} USD</span>
        )}
      </button>

      {process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_PAYMENT_BYPASS === "true" && (
        <div className="mt-6 pt-6 border-t border-[#353535]">
          <div className="text-center text-[#DB0101] text-[10px] md:text-xs font-bold uppercase mb-3 tracking-widest">
            DEVELOPMENT PAYMENT BYPASS ENABLED
          </div>
          <button
            type="button"
            onClick={async () => {
              if (!formData.name || !formData.email || !formData.phone) {
                setError("Please fill in Name, Email, and Phone to test bypass.");
                return;
              }
              setLoading(true);
              setError("");
              try {
                const res = await fetch("/api/bypass-payment", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...formData, orderBump }),
                });
                const data = await res.json();
                if (data.success && data.transactionId) {
                  window.location.href = `/upsell?payment_intent=${data.transactionId}`;
                } else {
                  throw new Error(data.error || "Bypass failed");
                }
              } catch (err: any) {
                setError(err.message || "Bypass error");
                setLoading(false);
              }
            }}
            disabled={loading || updatingPrice}
            className="w-full bg-[#1A1A1A] text-[#F8B001] border-2 border-[#F8B001] font-bold py-3 md:py-4 rounded-[8px] md:rounded-[10px] uppercase text-sm md:text-base transition-colors hover:bg-[#F8B001] hover:text-[#000000] cursor-pointer disabled:opacity-75"
          >
            TEST ONLY — CONTINUE WITHOUT STRIPE
          </button>
        </div>
      )}
    </>
  );
}

function CheckoutSkeleton({ orderBump, setOrderBump, total }: any) {
  return (
    <>
      <div className="space-y-4">
        <span className="block text-sm font-bold text-[#E9EAEA] mb-1.5">Card Details</span>
        <div className="bg-[#000000] border border-[#353535] rounded-[6px] p-4 min-h-[150px] md:min-h-[170px] flex items-center justify-center">
          <div className="flex items-center gap-3 text-[#A7A7A7] font-medium text-sm md:text-base">
            <Loader2 className="w-5 h-5 animate-spin text-[#F8B001]" />
            Secure payment form loading...
          </div>
        </div>
      </div>

      <OrderBumpSection orderBump={orderBump} setOrderBump={setOrderBump} />
      <OrderSummary orderBump={orderBump} total={total} updatingPrice={false} />

      <button
        disabled
        className="w-full bg-[#006E27] opacity-60 text-[#FFFFFF] font-bold py-4 md:py-5 rounded-[8px] md:rounded-[10px] uppercase text-lg md:text-xl flex items-center justify-center gap-3 border-none min-h-[64px] cursor-not-allowed"
      >
        <span>COMPLETE ORDER FOR ${total.toFixed(2)} USD</span>
      </button>
    </>
  );
}

function OrderBumpSection({ orderBump, setOrderBump }: { orderBump: boolean, setOrderBump: (b: boolean) => void }) {
  return (
    <div 
      onClick={() => setOrderBump(!orderBump)}
      className="w-full bg-[#000000] border-2 border-[#353A40] rounded-[10px] p-5 md:p-6 cursor-pointer transition-all duration-300"
      role="checkbox"
      aria-checked={orderBump}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setOrderBump(!orderBump);
        }
      }}
    >
      <div className="flex gap-4 items-start">
        <div className={`mt-1 w-8 h-8 md:w-10 md:h-10 rounded-[6px] flex items-center justify-center border-[3px] flex-shrink-0 transition-colors ${orderBump ? 'border-[#F8B001] bg-[#000000]' : 'border-[#454545] bg-[#000000]'}`}>
          {orderBump && <Check className="w-5 h-5 md:w-6 md:h-6 text-[#F8B001]" strokeWidth={4} />}
        </div>
        <div className="flex-1">
          <h3 className="text-[#DB0101] font-[900] uppercase text-xl md:text-2xl leading-[1.1] tracking-tight mb-3">
            TRUST ME, YOU WANT THIS<br className="hidden md:block"/> TOO
          </h3>
          <div className="bg-[#F8B001] text-[#000000] font-[900] text-sm md:text-base px-3 py-1 rounded-[4px] inline-block mb-4 tracking-tight">
            FOR $27 USD
          </div>
          <p className="text-[#E9EAEA] text-[15px] md:text-lg leading-[1.5] mb-4">
            Get Started with the <span className="text-[#F8B001] font-bold">One Viral Ad Launch SOP</span>: A step-by-step execution roadmap that takes you through <span className="text-[#F8B001] font-bold">EVERY STEP</span> of building and launching your <span className="text-[#F8B001] font-bold">viral ad campaign</span> — so you always know exactly <span className="text-[#F8B001] font-bold">WHAT TO DO NEXT</span> and can stay accountable until your campaign is live.
          </p>
          <p className="text-[#E9EAEA] text-[15px] md:text-lg leading-[1.5]">
            This is the perfect add-on to your Framework! <span className="font-[900] uppercase text-white">THIS OFFER IS NOT AVAILABLE ANYWHERE ELSE.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ orderBump, total, updatingPrice }: { orderBump: boolean, total: number, updatingPrice: boolean }) {
  return (
    <div className="bg-[#000000] border border-[#353535] rounded-[10px] p-5 md:p-6">
      <h3 className="text-[#E9EAEA] font-bold text-sm md:text-base uppercase tracking-wide border-b border-[#303030] pb-3 mb-4">Order Summary</h3>
      <div className="flex justify-between items-center text-[#E9EAEA] text-[15px] md:text-lg mb-3">
        <span>One Viral Ad Framework</span>
        <span>$17.00 USD</span>
      </div>
      {orderBump && (
        <div className="flex justify-between items-center text-[#E9EAEA] text-[15px] md:text-lg mb-3">
          <span>One Viral Ad Launch SOP</span>
          <span>$27.00 USD</span>
        </div>
      )}
      <div className="flex justify-between items-center text-[#FFFFFF] font-[900] text-xl md:text-2xl border-t border-[#303030] pt-4 mt-2">
        <span>Total</span>
        <span className="flex items-center gap-2">
          {updatingPrice && <Loader2 className="w-5 h-5 animate-spin text-[#F8B001]" />}
          ${total.toFixed(2)} USD
        </span>
      </div>
    </div>
  );
}

