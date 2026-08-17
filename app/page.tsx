"use client";

import React, { useState, useEffect, Suspense } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from "@/components/CheckoutForm";
import { CircleDollarSign, Timer, User, Shirt, Lock, Plus, ChevronDown, Minus, ChevronUp } from "lucide-react";
import { fbEvent } from "@/components/FacebookPixel";
import { readSessionStorage, writeSessionStorage } from "@/lib/browser";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function LandingPageContent() {
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [checkoutInitError, setCheckoutInitError] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (lightboxImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxImage]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = "fb_viewcontent_preorder";
    if (!readSessionStorage(key)) {
      fbEvent("ViewContent", {
        content_name: "One Viral Ad Framework Preorder Landing",
        content_category: "Framework",
      });
      writeSessionStorage(key, "1");
    }

    initStripe();
  }, []);

  const initStripe = async () => {
    setCheckoutInitError(false);
    try {
      const res = await fetch("/api/create-payment-intent", { method: "POST", body: "{}" });
      const data = await res.json();
      if (data.clientSecret && data.paymentIntentId) {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } else {
        throw new Error(data.error || "Missing clientSecret in response");
      }
    } catch (err) {
      console.error("Failed to preload payment intent:", err);
      setCheckoutInitError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#F1F1F1] font-sans selection:bg-[#F8B001] selection:text-black" style={{ WebkitTextSizeAdjust: "100%", textSizeAdjust: "100%" }}>
      <main className="w-[min(94vw,1150px)] mx-auto px-2 sm:px-4 py-8 min-h-[100svh] flex flex-col items-center justify-start">
        
        {/* TOP CONTENT (HIDDEN DURING FAQ FOCUS) */}
        <div className={activeFaq !== null ? "hidden" : "w-full flex flex-col items-center"}>
          
          {/* SECTION 1 — EYEBROW */}
          <div className="text-center font-bold tracking-[0.2em] text-base md:text-xl lg:text-2xl mb-3 mt-2 sm:mt-4">
            <span className="text-[#DB0101]">//</span>
            <span className="text-[#F1F1F1] mx-2 sm:mx-3 uppercase">DISCOVER HOW</span>
            <span className="text-[#DB0101]">//</span>
          </div>

          {/* SECTION 2 — MAIN HERO HEADLINE */}
          <h1 className="w-full text-center font-[900] leading-[0.9] tracking-tight uppercase mb-4" style={{ fontSize: "clamp(36px, 5.5vw, 64px)" }}>
            <div className="text-[#F8B001]">STREETWEAR</div>
            <div className="text-[#F8B001]">BRAND OWNERS</div>
            <div>
              <span className="text-[#F1F1F1]">CAN </span>
              <span className="text-[#DB0101]">SELL OUT</span>
            </div>
            <div className="text-[#F1F1F1]">THEIR NEXT DROP</div>
          </h1>

          {/* SECTION 3 — "IN 30 DAYS" BADGE */}
          <div className="bg-[#F8B001] text-[#000000] font-bold uppercase px-4 py-1.5 rounded-md text-lg md:text-2xl mb-4 inline-block">
            IN 30 DAYS
          </div>

          {/* SECTION 4 — VIRAL AD PILL */}
          <div className="border-2 border-[#353535] rounded-full px-6 py-2 text-lg md:text-2xl font-bold uppercase mb-5 inline-block">
            <span className="text-[#F1F1F1]">WITH JUST </span>
            <span className="text-[#DB0101]">ONE VIRAL AD</span>
          </div>

          {/* SECTION 5 — DIVIDER */}
          <div className="w-full border-t border-[#303030] mb-5"></div>

          {/* SECTION 6 — FOUR BENEFITS */}
          <div className="w-full flex flex-row items-start justify-between gap-1 sm:gap-2 md:gap-4 mb-5">
            {/* Benefit 1 */}
            <div className="flex-1 flex flex-col items-center text-center px-1">
              <CircleDollarSign className="w-8 h-8 md:w-10 md:h-10 text-[#F8B001] mb-3" strokeWidth={1.5} />
              <div className="text-[#F1F1F1] font-bold text-xs sm:text-sm md:text-lg uppercase leading-tight mb-1">$30/DAY</div>
              <div className="text-[#919191] text-[10px] sm:text-xs md:text-sm leading-tight">Daily Ad Budget</div>
            </div>
            <div className="w-px bg-[#303030] self-stretch"></div>
            {/* Benefit 2 */}
            <div className="flex-1 flex flex-col items-center text-center px-1">
              <Timer className="w-8 h-8 md:w-10 md:h-10 text-[#F8B001] mb-3" strokeWidth={1.5} />
              <div className="text-[#F1F1F1] font-bold text-xs sm:text-sm md:text-lg uppercase leading-tight mb-1">60 MINUTES</div>
              <div className="text-[#919191] text-[10px] sm:text-xs md:text-sm leading-tight">To Set Everything Up</div>
            </div>
            <div className="w-px bg-[#303030] self-stretch"></div>
            {/* Benefit 3 */}
            <div className="flex-1 flex flex-col items-center text-center px-1">
              <User className="w-8 h-8 md:w-10 md:h-10 text-[#F8B001] mb-3" strokeWidth={1.5} />
              <div className="text-[#F1F1F1] font-bold text-xs sm:text-sm md:text-lg uppercase leading-tight mb-1">NO PRIOR</div>
              <div className="text-[#919191] text-[10px] sm:text-xs md:text-sm leading-tight">Marketing Experience<br/>Needed</div>
            </div>
            <div className="w-px bg-[#303030] self-stretch"></div>
            {/* Benefit 4 */}
            <div className="flex-1 flex flex-col items-center text-center px-1">
              <Shirt className="w-8 h-8 md:w-10 md:h-10 text-[#F8B001] mb-3" strokeWidth={1.5} />
              <div className="text-[#F1F1F1] font-bold text-xs sm:text-sm md:text-lg uppercase leading-tight mb-1">STREETWEAR OR</div>
              <div className="text-[#919191] text-[10px] sm:text-xs md:text-sm leading-tight">Identity-Driven<br/>Clothing Brands Only</div>
            </div>
          </div>

          {/* SECOND DIVIDER */}
          <div className="w-full border-t border-[#303030] mb-5"></div>

          {/* SECTION 7 — FRAMEWORK TITLE */}
          <h2 className="text-[#F1F1F1] font-bold uppercase tracking-tight mb-4 text-center w-full" style={{ fontSize: "clamp(22px, 3vw, 36px)" }}>
            ONE VIRAL AD FRAMEWORK
          </h2>

          {/* SECTION 8 — MAIN CTA */}
          <button 
            onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full max-w-[95%] sm:max-w-2xl bg-[#006E27] hover:bg-[#007C2C] text-[#FFFFFF] font-bold uppercase rounded-[8px] md:rounded-[12px] flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98] mb-8 mx-auto cursor-pointer border-none py-4"
            style={{ minHeight: "72px", fontSize: "clamp(18px, 2.5vw, 24px)" }}
          >
            <Lock className="w-6 h-6 md:w-8 md:h-8 text-white" />
            GET INSTANT ACCESS – $17 USD
          </button>
        </div>
        {/* END OF HIDDEN TOP CONTENT */}

        {/* SECTION 9 — FAQ LIST */}
        <div id="faq-section" className="w-full space-y-3 mb-10">
          {[
            "What is the One Viral Ad Framework?",
            "Why should I care about this framework?",
            "Is there a guarantee?",
            "Why should I trust you?"
          ].map((q, i) => {
            const isOpen = activeFaq === i;

            if (isOpen && i === 0) {
              return (
                <div key={i} className="w-full bg-[#000000] border-2 border-[#353535] rounded-[7px] md:rounded-[10px] overflow-hidden">
                  <button 
                    onClick={() => {
                      setActiveFaq(null);
                      setTimeout(() => {
                        document.getElementById('faq-section')?.scrollIntoView({ behavior: 'auto' });
                      }, 10);
                    }}
                    className="w-full p-4 md:p-6 flex items-center justify-between cursor-pointer text-left focus:outline-none focus:bg-white/5" 
                    aria-expanded="true"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F8B001] flex items-center justify-center text-[#000000]">
                        <Minus className="w-6 h-6 md:w-8 md:h-8" strokeWidth={4} />
                      </div>
                      <span className="text-[#F1F1F1] font-[800]" style={{ fontSize: "clamp(18px, 2vw, 24px)" }}>
                        What is the <span className="text-[#F8B001]">One Viral Ad</span> Framework?
                      </span>
                    </div>
                    <ChevronUp className="w-6 h-6 md:w-8 md:h-8 text-[#F8B001] flex-shrink-0 ml-2" strokeWidth={3} />
                  </button>
                  
                  <div className="w-[90%] mx-auto border-t border-[#353535]"></div>
                  
                  <div className="p-4 md:p-8 pb-6 text-[#F1F1F1] font-[500]" style={{ fontSize: "clamp(16px, 2.5vw, 24px)", lineHeight: 1.7 }}>
                    <p className="mb-10">
                      The One Viral Ad Framework is a step-by-step guide designed to help you create <span className="text-[#DB0101] font-[800]">ONE HIGH-CONVERTING AD</span> that can help sell out your next drop profitably in <span className="text-[#F8B001] font-[800]">30 DAYS.</span>
                    </p>
                    
                    <p className="mb-12">
                      It takes <span className="text-[#F8B001] font-[800]">60 MINUTES</span> to <span className="text-[#F8B001] font-[800]">BUILD YOUR ONE VIRAL AD FROM SCRATCH</span>, requires <span className="font-[800]">NO PRIOR MARKETING EXPERIENCE</span>, needs just <span className="text-[#F8B001] font-[800]">$30 USD/DAY IN AD SPEND</span>, and is designed specifically for <span className="text-[#F8B001] font-[800]">META ADS.</span>
                    </p>
                    
                    <button 
                      onClick={() => {
                        setActiveFaq(null);
                        setTimeout(() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' }), 10);
                      }}
                      className="w-full bg-[#006E27] hover:bg-[#007C2C] text-[#FFFFFF] font-bold uppercase rounded-[6px] md:rounded-[8px] flex items-center justify-center gap-3 transition-colors cursor-pointer border-none"
                      style={{ minHeight: "72px", fontSize: "clamp(18px, 2.5vw, 24px)" }}
                    >
                      <Lock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      GET INSTANT ACCESS – $17 USD
                    </button>
                  </div>
                </div>
              );
            }

            if (isOpen && i === 1) {
              return (
                <div key={i} className="w-full bg-[#000000] border-2 border-[#353535] rounded-[7px] md:rounded-[10px] overflow-hidden">
                  <button 
                    onClick={() => {
                      setActiveFaq(null);
                      setTimeout(() => {
                        document.getElementById('faq-section')?.scrollIntoView({ behavior: 'auto' });
                      }, 10);
                    }}
                    className="w-full p-4 md:p-6 flex items-center justify-between cursor-pointer text-left focus:outline-none focus:bg-white/5" 
                    aria-expanded="true"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F8B001] flex items-center justify-center text-[#000000]">
                        <Minus className="w-6 h-6 md:w-8 md:h-8" strokeWidth={4} />
                      </div>
                      <span className="text-[#E9EAEA] font-[800]" style={{ fontSize: "clamp(18px, 2vw, 24px)" }}>
                        {q}
                      </span>
                    </div>
                    <ChevronUp className="w-6 h-6 md:w-8 md:h-8 text-[#F8B001] flex-shrink-0 ml-2" strokeWidth={3} />
                  </button>
                  
                  <div className="w-[90%] mx-auto border-t border-[#303030]"></div>
                  
                  <div className="px-5 md:px-8 py-6 text-[#E9EAEA] font-[500]" style={{ fontSize: "clamp(16px, 2.5vw, 22px)", lineHeight: 1.6 }}>
                    <p className="mb-6">
                      You started your streetwear brand to be creative. To be artistic. Yet you spend most of your time trying to market it.
                    </p>
                    
                    <p className="mb-6">
                      Which means you're spending more time marketing your brand than creating it.
                    </p>

                    <p className="mb-10">
                      The One Viral Ad Framework helps you build <span className="text-[#DB0101] font-[800]">ONE HIGH-CONVERTING AD</span> so you can generate sales faster, spend less time promoting your brand, and <span className="text-[#F8B001] font-[800]">MORE TIME DOING CREATIVE WORK.</span>
                    </p>
                    
                    <button 
                      onClick={() => {
                        setActiveFaq(null);
                        setTimeout(() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' }), 10);
                      }}
                      className="w-full bg-[#006E27] hover:bg-[#007C2C] text-[#FFFFFF] font-bold uppercase rounded-[6px] md:rounded-[8px] flex items-center justify-center gap-3 transition-colors cursor-pointer border-none"
                      style={{ minHeight: "72px", fontSize: "clamp(18px, 2.5vw, 24px)" }}
                    >
                      <Lock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      GET INSTANT ACCESS FOR $17 USD
                    </button>
                  </div>
                </div>
              );
            }

            if (isOpen && i === 2) {
              return (
                <div key={i} className="w-full bg-[#000000] border-2 border-[#353535] rounded-[7px] md:rounded-[10px] overflow-hidden">
                  <button 
                    onClick={() => {
                      setActiveFaq(null);
                      setTimeout(() => {
                        document.getElementById('faq-section')?.scrollIntoView({ behavior: 'auto' });
                      }, 10);
                    }}
                    className="w-full p-4 md:p-6 flex items-center justify-between cursor-pointer text-left focus:outline-none focus:bg-white/5" 
                    aria-expanded="true"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F8B001] flex items-center justify-center text-[#000000]">
                        <Minus className="w-6 h-6 md:w-8 md:h-8" strokeWidth={4} />
                      </div>
                      <span className="text-[#E9EAEA] font-[800]" style={{ fontSize: "clamp(18px, 2vw, 24px)" }}>
                        {q}
                      </span>
                    </div>
                    <ChevronUp className="w-6 h-6 md:w-8 md:h-8 text-[#F8B001] flex-shrink-0 ml-2" strokeWidth={3} />
                  </button>
                  
                  <div className="w-[90%] mx-auto border-t border-[#303030]"></div>
                  
                  <div className="px-5 md:px-8 py-6 text-[#E9EAEA] font-[500]" style={{ fontSize: "clamp(16px, 2.5vw, 22px)", lineHeight: 1.6 }}>
                    <p className="mb-6">
                      While I can't guarantee you'll sell out your next drop in <span className="text-[#F8B001] font-[800]">30 DAYS</span>—because I don't control your work ethic or how well you implement the framework—I <span className="text-[#F8B001] font-[800]">CAN</span> guarantee you'll receive <span className="text-[#F8B001] font-[800]">far more value</span> than the <span className="text-[#F8B001] font-[800]">$17 USD</span> purchase price.
                    </p>
                    
                    <p className="mb-8">
                      If you don't, simply email me within <span className="text-[#F8B001] font-[800]">30 DAYS</span> and I'll refund your <span className="text-[#F8B001] font-[800]">$17 USD</span>.
                    </p>

                    <p className="mb-10 text-[#DB0101] font-[800] uppercase">
                      NO QUESTIONS ASKED.
                    </p>
                    
                    <button 
                      onClick={() => {
                        setActiveFaq(null);
                        setTimeout(() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' }), 10);
                      }}
                      className="w-full bg-[#006E27] hover:bg-[#007C2C] text-[#FFFFFF] font-bold uppercase rounded-[6px] md:rounded-[8px] flex items-center justify-center gap-3 transition-colors cursor-pointer border-none"
                      style={{ minHeight: "72px", fontSize: "clamp(18px, 2.5vw, 24px)" }}
                    >
                      <Lock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      GET INSTANT ACCESS FOR $17 USD
                    </button>
                  </div>
                </div>
              );
            }

            if (isOpen && i === 3) {
              return (
                <div key={i} className="w-full bg-[#000000] border-2 border-[#353535] rounded-[7px] md:rounded-[10px] overflow-hidden">
                  <button 
                    onClick={() => {
                      setActiveFaq(null);
                      setTimeout(() => {
                        document.getElementById('faq-section')?.scrollIntoView({ behavior: 'auto' });
                      }, 10);
                    }}
                    className="w-full p-4 md:p-6 flex items-center justify-between cursor-pointer text-left focus:outline-none focus:bg-white/5" 
                    aria-expanded="true"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F8B001] flex items-center justify-center text-[#000000]">
                        <Minus className="w-6 h-6 md:w-8 md:h-8" strokeWidth={4} />
                      </div>
                      <span className="text-[#E9EAEA] font-[800]" style={{ fontSize: "clamp(18px, 2vw, 24px)" }}>
                        {q}
                      </span>
                    </div>
                    <ChevronUp className="w-6 h-6 md:w-8 md:h-8 text-[#F8B001] flex-shrink-0 ml-2" strokeWidth={3} />
                  </button>
                  
                  <div className="w-[90%] mx-auto border-t border-[#303030]"></div>
                  
                  <div className="px-5 md:px-8 py-6 text-[#E9EAEA] font-[500]" style={{ fontSize: "clamp(16px, 2.5vw, 22px)", lineHeight: 1.6 }}>
                    <p className="mb-6">
                      I've helped a <span className="text-[#F8B001] font-[800]">streetwear brand</span> generate <span className="text-[#DB0101] font-[800]">OVER $1.2 MILLION USD</span> in additional revenue over <span className="text-[#F8B001] font-[800]">13 MONTHS</span> using <span className="text-[#F8B001] font-[800]">META ADS.</span>
                    </p>
                    
                    <p className="mb-6">
                      I also have <span className="text-[#DB0101] font-[800]">50+ WRITTEN TESTIMONIALS</span> and <span className="text-[#F8B001] font-[800]">10 VIDEO TESTIMONIALS</span> from clients in the <span className="text-[#F8B001] font-[800]">D2C ECOMMERCE</span> space.
                    </p>

                    <p className="mb-6">
                      Over the last year, I've focused heavily on studying <span className="text-[#F8B001] font-[800]">streetwear brands</span>, marketing strategies, and campaigns that consistently sell out drops.
                    </p>

                    <p className="mb-6">
                      The One Viral Ad Framework is the result of <span className="text-[#F8B001] font-[800]">EVERYTHING I LEARNED.</span>
                    </p>
                    
                    <p className="mb-6">
                      <span className="text-[#F8B001] font-[800]">Proof of my claims</span> is attached below.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-10">
                      <button 
                        type="button"
                        className="w-full bg-[#000000] border border-[#454545] rounded-[6px] overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#F8B001]"
                        onClick={(e) => { e.stopPropagation(); setLightboxImage("/Image 1 - left side.jpeg"); }}
                        aria-label="View Case study proof — $1.2M streetwear client"
                      >
                        <img 
                          src="/Image 1 - left side.jpeg" 
                          alt="Case study proof — $1.2M streetwear client" 
                          className="w-full h-auto object-contain" 
                          loading="lazy"
                        />
                      </button>
                      <button 
                        type="button"
                        className="w-full bg-[#000000] border border-[#454545] rounded-[6px] overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#F8B001]"
                        onClick={(e) => { e.stopPropagation(); setLightboxImage("/Image 2 - right side.jpeg"); }}
                        aria-label="View Client testimonial proof — written and video testimonials"
                      >
                        <img 
                          src="/Image 2 - right side.jpeg" 
                          alt="Client testimonial proof — written and video testimonials" 
                          className="w-full h-auto object-contain" 
                          loading="lazy"
                        />
                      </button>
                    </div>

                    <button 
                      onClick={() => {
                        setActiveFaq(null);
                        setTimeout(() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' }), 10);
                      }}
                      className="w-full bg-[#006E27] hover:bg-[#007C2C] text-[#FFFFFF] font-bold uppercase rounded-[6px] md:rounded-[8px] flex items-center justify-center gap-3 transition-colors cursor-pointer border-none"
                      style={{ minHeight: "72px", fontSize: "clamp(18px, 2.5vw, 24px)" }}
                    >
                      <Lock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      GET INSTANT ACCESS – $17 USD
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <button 
                key={i} 
                onClick={() => {
                  if (i === 0 || i === 1 || i === 2 || i === 3) {
                    setActiveFaq(i);
                    setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 10);
                  }
                }}
                className={`w-full bg-[#000000] border-2 border-[#353535] rounded-md p-4 flex items-center justify-between transition-colors text-left focus:outline-none focus:border-[#F8B001] cursor-pointer hover:border-[#454545]`} 
                aria-expanded="false"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#F8B001] flex items-center justify-center text-[#F8B001]">
                    <Plus className="w-5 h-5" strokeWidth={3} />
                  </div>
                  <span className="text-[#F1F1F1] font-bold pr-2" style={{ fontSize: "clamp(16px, 2vw, 22px)" }}>{q}</span>
                </div>
                <ChevronDown className="w-6 h-6 text-[#F8B001] flex-shrink-0" strokeWidth={3} />
              </button>
            );
          })}
        </div>

        {/* DISCLAIMER MOVED TO BOTTOM */}

        {/* LIGHTBOX MODAL */}
        {lightboxImage && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.85)]"
            onClick={() => setLightboxImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Image Preview"
          >
            <button 
              className="absolute top-4 right-4 text-white hover:text-[#F8B001] z-50 p-2 focus:outline-none focus:ring-2 focus:ring-[#F8B001]"
              onClick={() => setLightboxImage(null)}
              aria-label="Close Preview"
            >
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
            </button>
            <img 
              src={lightboxImage} 
              alt="Full Preview" 
              className="max-w-[calc(100vw-24px)] max-h-[calc(100svh-24px)] w-auto h-auto object-contain cursor-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* CHECKOUT SECTION */}
        <section className="w-full text-center pb-12 pt-4 md:pt-8" id="checkout">
          <h2 className="text-[#FFFFFF] font-[900] uppercase leading-[0.95] max-w-4xl mx-auto mb-5 md:mb-7 tracking-tight" style={{ fontSize: "clamp(32px, 4vw, 56px)" }}>
            READY TO <span className="text-[#DB0101]">SELL OUT</span> YOUR NEXT DROP <span className="text-[#F8B001]">IN 30 DAYS</span>?
          </h2>

          <div className="text-[#A7A7A7] font-medium max-w-2xl mx-auto mb-8 md:mb-11 leading-[1.35]" style={{ fontSize: "clamp(16px, 1.8vw, 22px)" }}>
            Complete the form below to <span className="text-[#F8B001]">Get Instant Access</span> <span className="text-[#DB0101]">To The One Viral Ad Framework</span> Now
          </div>

          {checkoutInitError ? (
            <div className="max-w-[min(92vw,850px)] mx-auto bg-[#DB0101]/10 border border-[#DB0101] text-[#DB0101] text-sm md:text-base font-bold p-6 rounded-[10px] text-center leading-tight">
              Secure checkout could not load. Please check your connection and try again.
              <button
                onClick={initStripe}
                className="block mx-auto mt-4 bg-[#DB0101] text-white font-bold uppercase px-6 py-3 rounded-[6px] cursor-pointer border-none"
              >
                Retry
              </button>
            </div>
          ) : (
            <CheckoutForm paymentIntentId={paymentIntentId} clientSecret={clientSecret} stripePromise={stripePromise} />
          )}
        </section>

        {/* SECTION 10 — DISCLAIMER */}
        <div className="text-[#A7A7A7] text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] text-center max-w-[760px] mx-auto mt-12 mb-8 leading-[1.45]">
          Disclaimer: The results expressed in this training are illustrative and not guaranteed. Your success is entirely up to you and the work you put in.
        </div>

      </main>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-[#F8B001] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LandingPageContent />
    </Suspense>
  );
}
