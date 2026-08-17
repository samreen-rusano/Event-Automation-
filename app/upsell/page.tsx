"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Check, Lock, MessageCircle, ClipboardCheck, HelpCircle, Rocket } from "lucide-react";

function UpsellContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const originalPaymentIntentId = searchParams.get("payment_intent");
  // Stripe appends this automatically on redirect from confirmPayment(); only "succeeded" means the
  // original $17/$44 charge actually went through.
  const redirectStatus = searchParams.get("redirect_status");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Prevent multiple successful purchases from being created
  useEffect(() => {
    const hasBoughtUpsell = localStorage.getItem(`upsell_purchased_${originalPaymentIntentId}`);
    if (hasBoughtUpsell) {
      setSuccess(true);
    }
  }, [originalPaymentIntentId]);

  // Guard against showing "YOUR ORDER IS SUCCESSFUL!" when the original payment actually failed
  // (e.g. bank decline during the required-action redirect flow).
  if (originalPaymentIntentId && redirectStatus && redirectStatus !== "succeeded") {
    return (
      <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center text-[#E9EAEA] p-6 text-center font-sans">
        <h1 className="text-2xl font-bold mb-4 text-[#DB0101]">Payment Not Completed</h1>
        <p className="text-[#A0A0A0] mb-8">Your payment was not successful. Please try again.</p>
        <button onClick={() => router.push("/")} className="text-[#F8B001] hover:underline font-bold">Return to Home</button>
      </div>
    );
  }

  const handleAcceptUpsell = async () => {
    if (success) return; // Prevent double trigger
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/create-upsell-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalPaymentIntentId }),
      });
      const data = await res.json();
      
      if (data.success && data.paymentIntentId) {
        setSuccess(true);
        localStorage.setItem(`upsell_purchased_${originalPaymentIntentId}`, "true");
      } else {
        throw new Error(data.error || "Could not process upsell payment");
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      setError(error.message || "Payment failed. Please try again or contact support.");
    } finally {
      setLoading(false);
    }
  };

  if (!originalPaymentIntentId) {
    return (
      <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center text-[#E9EAEA] p-6 text-center font-sans">
        <h1 className="text-2xl font-bold mb-4">Invalid Access</h1>
        <p className="text-[#A0A0A0] mb-8">No purchase found.</p>
        <button onClick={() => router.push("/")} className="text-[#F8B001] hover:underline font-bold">Return to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#E9EAEA] font-sans flex justify-center pt-6 pb-12 px-2 md:px-6">
      <div className="w-full max-w-[min(98vw,900px)] bg-[#000000] border-2 border-[#353535] rounded-[8px] md:rounded-[10px] p-6 md:p-10 mx-auto shadow-2xl relative">
        
        {/* Success Icon */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="w-8 h-[2px] bg-[#F8B001]/60"></div>
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-[3px] border-[#F8B001] flex items-center justify-center">
            <Check className="w-8 h-8 md:w-10 md:h-10 text-[#F8B001]" strokeWidth={4} />
          </div>
          <div className="w-8 h-[2px] bg-[#F8B001]/60"></div>
        </div>

        {/* Success Headline */}
        <h1 className="text-center font-[900] leading-[1] mb-6 uppercase tracking-tight" style={{ fontSize: "clamp(42px, 6vw, 76px)" }}>
          <span className="text-[#E9EAEA] block">YOUR ORDER IS</span>
          <span className="text-[#F8B001] block mt-1">SUCCESSFUL!</span>
        </h1>

        <div className="w-full h-px bg-[#353535] mx-auto mb-6 max-w-2xl"></div>

        {/* Confirmation Copy */}
        <p className="text-center text-[#A0A0A0] text-lg md:text-2xl font-medium mb-10 max-w-2xl mx-auto leading-tight">
          <span className="text-[#E9EAEA]">Please check your email to gain access to </span><br className="hidden md:block"/>
          <span className="text-[#F8B001]">your purchase.</span>
        </p>

        {/* UPSell Content */}
        {!success ? (
          <div className="w-full">
            {/* ONE-TIME OFFER */}
            <div className="flex justify-center mb-6">
              <span className="bg-[#DB0101] text-[#FFFFFF] uppercase font-[900] text-sm md:text-lg px-4 md:px-5 py-1.5 md:py-2 rounded-[4px] tracking-wide">
                ONE-TIME OFFER
              </span>
            </div>

            {/* Upsell Headline */}
            <h2 className="text-center font-[900] text-[34px] md:text-[54px] leading-[1.1] mb-6 uppercase tracking-tight">
              <span className="text-[#E9EAEA]">BUILD YOUR </span>
              <span className="text-[#F8B001]">VIRAL AD </span>
              <span className="text-[#E9EAEA]">WITH US</span>
            </h2>

            {/* Urgency */}
            <div className="flex justify-center items-center gap-3 md:gap-4 mb-10">
              <div className="w-8 md:w-16 h-px bg-[#DB0101]"></div>
              <span className="text-[#DB0101] uppercase font-[900] text-sm md:text-xl tracking-widest">IN THE NEXT 24 HOURS</span>
              <div className="w-8 md:w-16 h-px bg-[#DB0101]"></div>
            </div>

            {/* Four Benefits Grid */}
            <div className="grid grid-cols-4 gap-2 md:gap-6 mb-10 border-b border-[#353535] pb-10">
              
              <div className="flex flex-col items-center text-center">
                <MessageCircle className="w-8 h-8 md:w-12 md:h-12 text-[#F8B001] mb-3 md:mb-4" strokeWidth={1.5} />
                <h3 className="text-[#E9EAEA] uppercase font-[900] text-[10px] sm:text-xs md:text-lg leading-[1.1] mb-2 md:mb-3">24-HOUR<br/>SLACK ACCESS</h3>
                <div className="w-6 h-[2px] bg-[#F8B001] mb-2 md:mb-3"></div>
                <p className="text-[#A0A0A0] text-[10px] sm:text-xs md:text-base leading-tight px-1">Get direct access<br/>to us in Slack.</p>
              </div>
              
              <div className="flex flex-col items-center text-center border-l border-[#353535]">
                <ClipboardCheck className="w-8 h-8 md:w-12 md:h-12 text-[#F8B001] mb-3 md:mb-4" strokeWidth={1.5} />
                <h3 className="text-[#E9EAEA] uppercase font-[900] text-[10px] sm:text-xs md:text-lg leading-[1.1] mb-2 md:mb-3">REVIEW &<br/>FEEDBACK</h3>
                <div className="w-6 h-[2px] bg-[#F8B001] mb-2 md:mb-3"></div>
                <p className="text-[#A0A0A0] text-[10px] sm:text-xs md:text-base leading-tight px-1">We'll review your<br/>ad and give you<br/>honest feedback.</p>
              </div>
              
              <div className="flex flex-col items-center text-center border-l border-[#353535]">
                <HelpCircle className="w-8 h-8 md:w-12 md:h-12 text-[#F8B001] mb-3 md:mb-4" strokeWidth={1.5} />
                <h3 className="text-[#E9EAEA] uppercase font-[900] text-[10px] sm:text-xs md:text-lg leading-[1.1] mb-2 md:mb-3">ASK ANY<br/>QUESTIONS</h3>
                <div className="w-6 h-[2px] bg-[#F8B001] mb-2 md:mb-3"></div>
                <p className="text-[#A0A0A0] text-[10px] sm:text-xs md:text-base leading-tight px-1">Get answers<br/>whenever you're<br/>stuck or second-<br/>guessing a decision.</p>
              </div>
              
              <div className="flex flex-col items-center text-center border-l border-[#353535]">
                <Rocket className="w-8 h-8 md:w-12 md:h-12 text-[#F8B001] mb-3 md:mb-4" strokeWidth={1.5} />
                <h3 className="text-[#E9EAEA] uppercase font-[900] text-[10px] sm:text-xs md:text-lg leading-[1.1] mb-2 md:mb-3">LAUNCH WITH<br/>CONFIDENCE</h3>
                <div className="w-6 h-[2px] bg-[#F8B001] mb-2 md:mb-3"></div>
                <p className="text-[#A0A0A0] text-[10px] sm:text-xs md:text-base leading-tight px-1">Get our perspective<br/>before you spend<br/>money launching<br/>your ad.</p>
              </div>
            </div>

            {/* Price block */}
            <p className="text-center text-[#E9EAEA] uppercase font-bold text-sm md:text-lg tracking-widest mb-3">ALL THIS FOR JUST</p>
            <div className="flex justify-center mb-8 md:mb-10">
              <div className="bg-[#F8B001] text-[#000000] font-[900] text-5xl md:text-7xl px-12 md:px-16 py-3 md:py-4 rounded-[6px] md:rounded-[8px] leading-none">
                $57 USD
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-[#DB0101]/10 border border-[#DB0101] text-[#DB0101] text-sm md:text-base font-bold p-4 rounded-md text-center leading-tight mb-6 max-w-2xl mx-auto">
                {error}
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleAcceptUpsell}
              disabled={loading}
              className="w-full max-w-3xl mx-auto bg-[#006E27] hover:bg-[#007C2C] text-[#FFFFFF] font-[900] py-5 md:py-6 rounded-[8px] md:rounded-[10px] uppercase text-base sm:text-lg md:text-2xl transition-colors cursor-pointer disabled:opacity-80 flex items-center justify-center gap-3 md:gap-4 border-none min-h-[72px] md:min-h-[88px] leading-tight px-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-white animate-spin" />
                  <span>PROCESSING...</span>
                </>
              ) : (
                <>
                  <Lock className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
                  <span>YES! BUILD MY VIRAL AD WITH YOU – $57 USD</span>
                </>
              )}
            </button>
            <div className="text-center text-xs text-[#A0A0A0] mt-4 font-medium uppercase tracking-wider">
              1-Click Secure Purchase
            </div>
          </div>
        ) : (
          <div className="w-full text-center pt-8 border-t border-[#353535] mt-8 animate-in fade-in duration-500">
            <h2 className="text-[#00A36C] font-black text-2xl md:text-4xl mb-4 uppercase">
              Thank you for your order. Please check email - Yasir
            </h2>
          </div>
        )}

      </div>
    </div>
  );
}

export default function UpsellPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#000000] flex items-center justify-center"><Loader2 className="w-10 h-10 text-[#F8B001] animate-spin" /></div>}>
      <UpsellContent />
    </Suspense>
  );
}
