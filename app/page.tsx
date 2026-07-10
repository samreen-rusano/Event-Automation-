"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ShoppingCart, Mail, Phone, Globe, User, Loader2, CheckCircle, ShieldCheck } from "lucide-react";
import { fbEvent } from "@/components/FacebookPixel";
import { readSessionStorage, writeSessionStorage } from "@/lib/browser";

function LandingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // Form & checkout state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", website: "" });
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Payment confirmation state
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentError, setPaymentError] = useState("");

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

  // Verify payment if session_id is in query params
  useEffect(() => {
    if (!sessionId) return;

    const verify = async () => {
      setVerifyingPayment(true);
      try {
        const res = await fetch(`/api/verify-session?session_id=${sessionId}`);
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
    if (!formData.name || !formData.email || !formData.phone || !formData.website) {
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

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not create checkout session.");
      }

      window.location.href = data.url;
    } catch (err: any) {
      setCheckoutError(err.message || "An error occurred during checkout initialization.");
      setLoading(false);
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
          <div className="flex items-center gap-2 mb-1.5 text-[#FF2E2E] font-black text-xs sm:text-sm tracking-widest uppercase">
            <span>\</span>
            <span className="text-white">DISCOVER HOW</span>
            <span>/</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[40px] xl:text-[46px] font-black leading-[1.08] tracking-tight uppercase mb-3 flex flex-col">
            <span className="text-[#FFB800] drop-shadow-[0_4px_12px_rgba(255,184,0,0.15)]">STREETWEAR BRAND OWNERS</span>
            <span className="text-white mt-0.5">CAN SELL OUT THEIR NEXT DROP</span>
          </h1>

          {/* Yellow Brush stroke wrapper */}
          <div className="inline-block bg-[#FFB800] text-black px-5 py-1.5 sm:py-2.5 font-black text-xl sm:text-3xl lg:text-2xl xl:text-3xl uppercase rounded-lg shadow-lg mb-4 rotate-[-1deg] transform hover:scale-[1.02] transition-transform">
            IN 30 DAYS
          </div>

          {/* White Border text */}
          <div className="border border-white/40 rounded-full px-5 py-1.5 text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-wide bg-white/5">
            WITH JUST <span className="text-[#FF2E2E] font-black">ONE VIRAL AD</span>
          </div>
        </div>

        {/* 2. REQUIREMENTS ZONE */}
        <div className="w-full mb-6 lg:mb-6 text-center">
          <div className="text-[10px] sm:text-xs font-black tracking-widest text-gray-500 uppercase mb-3">
            — REQUIREMENTS —
          </div>

          {/* Desktop Horizontal / Mobile Vertical Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 items-stretch max-w-3xl mx-auto">
            
            {/* Req 1 */}
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3.5 border border-white/10 lg:border-none lg:bg-transparent lg:p-0 lg:flex-row lg:justify-center">
              <div className="w-8 h-8 rounded-full bg-[#FF2E2E] text-white flex items-center justify-center font-black text-base shadow-[0_0_15px_rgba(255,46,46,0.3)] shrink-0">
                $
              </div>
              <div className="text-left">
                <div className="text-[#FFB800] font-black text-xs sm:text-sm">$30/DAY</div>
                <div className="text-white font-bold text-[10px] uppercase tracking-wide text-gray-400">AD SPEND</div>
              </div>
            </div>

            {/* Divider (Desktop Only) */}
            <div className="hidden lg:block w-px bg-white/20 self-stretch my-1" />

            {/* Req 2 */}
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3.5 border border-white/10 lg:border-none lg:bg-transparent lg:p-0 lg:flex-row lg:justify-center">
              <div className="w-8 h-8 rounded-full bg-[#FF2E2E] text-white flex items-center justify-center font-black text-base shadow-[0_0_15px_rgba(255,46,46,0.3)] shrink-0">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2V9h2v7zm0-9h-2V5h2v2z"/></svg>
              </div>
              <div className="text-left">
                <div className="text-[#FFB800] font-black text-xs sm:text-sm">60 MINUTES</div>
                <div className="text-white font-bold text-[10px] uppercase tracking-wide text-gray-400">TO SET UP</div>
              </div>
            </div>

            {/* Divider (Desktop Only) */}
            <div className="hidden lg:block w-px bg-white/20 self-stretch my-1" />

            {/* Req 3 */}
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3.5 border border-white/10 lg:border-none lg:bg-transparent lg:p-0 lg:flex-row lg:justify-center">
              <div className="w-8 h-8 rounded-full bg-[#FF2E2E] text-white flex items-center justify-center font-black text-base shadow-[0_0_15px_rgba(255,46,46,0.3)] shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-[#FFB800] font-black text-xs sm:text-sm">NO PRIOR</div>
                <div className="text-white font-bold text-[10px] uppercase tracking-wide text-gray-400">MARKETING EXP</div>
              </div>
            </div>

            {/* Divider (Desktop Only) */}
            <div className="hidden lg:block w-px bg-white/20 self-stretch my-1" />

            {/* Req 4 */}
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3.5 border border-white/10 lg:border-none lg:bg-transparent lg:p-0 lg:flex-row lg:justify-center col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="w-8 h-8 rounded-full bg-[#FF2E2E] text-white flex items-center justify-center font-black text-base shadow-[0_0_15px_rgba(255,46,46,0.3)] shrink-0 relative">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"/></svg>
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[8px] font-black px-1 rounded-full border border-black leading-none py-0.5">2</span>
              </div>
              <div className="text-left">
                <div className="text-[#FFB800] font-black text-xs sm:text-sm leading-tight">STREETWEAR BRANDS</div>
                <div className="text-white font-bold text-[9px] uppercase tracking-wide text-gray-400 leading-none mt-0.5">ONLY</div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. PRE-ORDER ACTION CARD */}
        <div className="bg-[#0e0e0e] border border-[#FF6B00]/40 rounded-3xl p-5 sm:p-7 text-center shadow-[0_0_30px_rgba(255,107,0,0.1)] hover:border-[#FF6B00] transition-colors duration-300 max-w-md mx-auto w-full mb-4">
          <h2 className="text-sm sm:text-base font-black tracking-wider uppercase mb-4">
            PRE-ORDER THE <span className="text-[#FF2E2E]">ONE VIRAL AD FRAMEWORK</span>
          </h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-gradient-to-r from-[#FF6B00] to-[#E03E00] hover:from-[#E03E00] hover:to-[#FF6B00] text-white font-black text-base py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-3 shadow-[0_6px_25px_rgba(255,107,0,0.3)] hover:shadow-[0_8px_30px_rgba(255,107,0,0.4)] transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span>PRE-ORDER NOW FOR JUST $4.95</span>
          </button>

          <div className="flex items-center justify-center gap-2 mt-3 text-xs font-semibold text-gray-400">
            <Mail className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Delivered to your inbox within <strong className="text-[#FFB800]">14 days.</strong></span>
          </div>
        </div>

      </div>

      {/* 4. DISCLAIMER FOOTER ZONE */}
      <div className="text-center mt-auto py-1">
        <p className="text-[10px] sm:text-[11px] text-gray-600 max-w-xl mx-auto leading-relaxed">
          Disclaimer: The results expressed in this training are illustrative and not guaranteed. Your success is entirely up to you and the work you put in.
        </p>
      </div>

      {/* PRE-ORDER INPUT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-250">
          <div className="relative w-full max-w-md bg-[#0e0e0e] border border-[#FF6B00]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(255,107,0,0.2)] flex flex-col max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white leading-tight">
                Secure Your Pre-Order
              </h3>
              <p className="text-gray-400 text-xs mt-1.5">
                Fill in your details below to proceed to the checkout page.
              </p>
            </div>

            {checkoutError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-3.5 rounded-xl text-center mb-4 leading-tight">
                {checkoutError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCheckoutSubmit} className="space-y-4 flex-1">
              
              {/* Name */}
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  required
                  type="text"
                  placeholder="Full Name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 focus:border-[#FF6B00] rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  required
                  type="email"
                  placeholder="Email Address..."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 focus:border-[#FF6B00] rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-colors"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  required
                  type="tel"
                  placeholder="Phone Number..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 focus:border-[#FF6B00] rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-colors"
                />
              </div>

              {/* Website */}
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  required
                  type="text"
                  placeholder="Website URL... (e.g. brand.com)"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 focus:border-[#FF6B00] rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-colors"
                />
              </div>

              {/* Submit / Proceed */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6B00] hover:bg-[#e05a00] text-black font-black py-3.5 rounded-xl uppercase tracking-wider text-sm transition-colors cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 text-black animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <span>PROCEED TO PAYMENT</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                <span>Secure 256-bit Stripe checkout</span>
              </div>
            </form>
          </div>
        </div>
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
