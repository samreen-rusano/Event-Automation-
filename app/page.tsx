"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, CalendarCheck, Mail, Video, Clock, ArrowRight, Check, Sparkles, ShieldCheck } from "lucide-react";
import { fbEvent } from "@/components/FacebookPixel";
import { readSessionStorage, writeSessionStorage } from "@/lib/browser";
import { MEET_DETAILS } from "@/lib/config";

// Reusable custom bullet point component
const BulletIcon = ({ num }: { num: number }) => (
  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#F46F00] to-[#E34200] text-white font-extrabold text-sm shrink-0 shadow-[0_4px_12px_rgba(244,111,0,0.3)] select-none">
    {num}
  </div>
);

// Minimalist checkmark
const CheckIcon = () => (
  <svg className="w-5 h-5 text-[#F46F00] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

export default function WorkshopLandingPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", website: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [visitorCount, setVisitorCount] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const trackScrollCtaClick = (placement: "top" | "middle" | "bottom") => {
    fbEvent("CTAButtonClick", {
      button_type: "scroll_to_form",
      placement,
      page: "landing",
    });
  };

  // Track visitor on mount
  useEffect(() => {
    fetch("/api/visitors", { method: "POST" })
      .then(res => res.json())
      .then(data => setVisitorCount(data.count))
      .catch(() => { });
  }, []);

  // Track landing page intent once per browser tab session.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = "fb_viewcontent_landing";
    if (readSessionStorage(key)) return;

    fbEvent("ViewContent", {
      content_name: "Sales Engine Workshop Landing",
      content_category: "Workshop",
    });
    writeSessionStorage(key, "1");
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById("register-form");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 32;
      if ("scrollBehavior" in document.documentElement.style) {
        window.scrollTo({ top, behavior: "smooth" });
        return;
      }
      window.scrollTo(0, top);
    }
  };

  /* 
  // FUTURE STRIPE REDO PAYMENT METHOD
  // Uncomment this code to revert back to Stripe $97 payment flow
  const handleStripePayment = async () => {
    setLoading(true);
    setError("");

    try {
      fbEvent("InitiateCheckout", {
        value: 97,
        currency: "USD",
        content_name: "Sales Engine Workshop",
      });

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not create payment session.");
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      setLoading(false);
    }
  };
  */

  const handleFreeRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.website) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      fbEvent("Lead", {
        content_name: "Workshop Registration Form",
      });

      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong during registration.");
      }

      setSuccess(true);
      // Track registration completion pixel
      fbEvent("CompleteRegistration", {
        content_name: "Sales Engine Workshop",
        status: "Free",
      });
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a202c] font-sans selection:bg-[#F46F00] selection:text-white pb-16">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-12 flex flex-col items-center">
        {/* Live Visitor Counter */}
        {visitorCount > 0 && (
          <div className="flex items-center gap-2 mb-8 text-[13px] text-gray-600 font-medium bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span><strong className="text-gray-900">{visitorCount.toLocaleString()}</strong> times people have viewed this page</span>
          </div>
        )}

        {/* Headline */}
        <div className="text-center w-full max-w-[1000px] mb-10">
          <h1 className="text-[32px] sm:text-5xl md:text-[56px] font-black leading-[1.15] tracking-tight uppercase flex flex-col gap-4">
            <span className="text-[#B34700]">Streetwear Brand Owners!</span>
            <span className="text-[#1a202c]">Join Our FREE 4-Week Sell Out Your Drop Challenge</span>
          </h1>
        </div>

        {/* Information Section */}
        <div className="w-full md:max-w-[900px] mx-auto mb-12 space-y-10 text-left bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
          
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 border-b-2 border-[#F46F00] pb-2 inline-block">To qualify, you must:</h2>
            <ul className="space-y-3 text-lg md:text-xl font-medium text-gray-700">
              <li className="flex gap-3"><Check className="text-green-600 shrink-0 mt-1" /> Own a streetwear or movement-driven clothing brand.</li>
              <li className="flex gap-3"><Check className="text-green-600 shrink-0 mt-1" /> Have sold at least $2,500 worth of inventory in the last 90 days.</li>
              <li className="flex gap-3"><Check className="text-green-600 shrink-0 mt-1" /> Be able to invest $30/day into Meta ads.</li>
              <li className="flex gap-3"><Check className="text-green-600 shrink-0 mt-1" /> Be genuinely passionate about building your clothing brand.</li>
            </ul>
          </div>

          <div className="space-y-4 bg-red-50 p-6 rounded-2xl border border-red-100">
            <h2 className="text-2xl md:text-3xl font-black text-red-700 pb-2">This Challenge Is NOT For You If...</h2>
            <ul className="space-y-3 text-lg md:text-xl font-medium text-red-800">
              <li className="flex gap-3"><X className="text-red-500 shrink-0 mt-1" /> You haven't sold at least $2,500 worth of inventory in the last 90 days.</li>
              <li className="flex gap-3"><X className="text-red-500 shrink-0 mt-1" /> You're not passionate about building your clothing brand.</li>
            </ul>
          </div>

          <div className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Do You Qualify?</h2>
            <p className="text-lg md:text-xl text-gray-700 font-medium">If yes, click the button below to reserve your free spot.</p>
            <p className="text-lg md:text-xl text-gray-700 font-medium">Once you reserve your spot, I'll send you a series of emails over the next few days explaining:</p>
            <ul className="space-y-2 text-lg md:text-xl text-gray-700 font-medium pl-4 list-disc ml-4 marker:text-[#F46F00]">
              <li>How the challenge works.</li>
              <li>What's included.</li>
              <li>Why it works.</li>
              <li>How to know whether it's the right fit for your brand.</li>
            </ul>
            <p className="text-lg md:text-xl text-gray-700 font-medium pt-2">After that, you can decide whether or not you'd like to join the challenge.</p>
          </div>

          <div className="pt-6">
            <Button
              type="button"
              onClick={() => {
                trackScrollCtaClick("middle");
                scrollToForm();
              }}
              className="w-full bg-gradient-to-r from-[#F46F00] to-[#E34200] hover:from-[#E34200] hover:to-[#F46F00] text-white font-black text-[18px] sm:text-[22px] py-6 sm:py-8 rounded-2xl shadow-[0_10px_30px_rgba(244,111,0,0.3)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] uppercase tracking-wider h-auto whitespace-normal leading-tight px-4 cursor-pointer"
            >
              RESERVE YOUR FREE SPOT
            </Button>
          </div>
        </div>

        {/* Forms Container */}
        <div id="register-form" className="w-full md:w-[1100px] bg-white rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.3)] mb-8 overflow-hidden text-black border border-gray-100 transition-all duration-500">
          {success ? (
            <div className="p-8 sm:p-12 text-center flex flex-col items-center max-w-[850px] mx-auto bg-white">
              <div className="w-24 h-24 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mb-8 shadow-md">
                <span className="text-5xl">🎉</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4 uppercase">SUCCESS — YOU'RE REGISTERED!</h3>
              <p className="text-gray-700 text-[20px] mb-8 font-semibold">Check your email for the next step.</p>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 md:p-8 text-left rounded-r-xl max-w-2xl w-full mx-auto shadow-sm">
                <p className="text-gray-800 text-[16px] md:text-[18px] font-medium leading-relaxed mb-4">
                  If you don't see my email, please check your <strong>Spam</strong> or <strong>Promotions</strong> folder.
                </p>
                <p className="text-gray-800 text-[16px] md:text-[18px] font-medium leading-relaxed">
                  Once you find it, mark it as <strong>"Not Spam"</strong> and move it to your Primary Inbox so you don't miss any future emails.
                </p>
              </div>
            </div>
          ) : (
            <div className="px-6 py-10 md:px-12 md:py-14 flex flex-col items-center">
              <h3 className="text-2xl sm:text-3xl font-black text-center text-gray-900 mb-2 tracking-tight">RESERVE YOUR PLACE FOR FREE</h3>
              <p className="text-gray-500 text-[14px] sm:text-[16px] text-center mb-8 font-medium">Enter your details to receive access instructions instantly.</p>

              {error && <div className="w-full max-w-[600px] text-red-600 text-sm font-semibold text-center bg-red-50 border border-red-200 p-3.5 rounded-xl mb-6">{error}</div>}

              <form onSubmit={handleFreeRegistration} className="w-full max-w-[600px] flex flex-col space-y-4">
                <Input
                  required
                  placeholder="Full Name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-50 border-gray-300 h-13 text-[15px] rounded-xl focus-visible:ring-[#F46F00] focus-visible:border-[#F46F00]"
                />
                <Input
                  type="email"
                  required
                  placeholder="Email Address..."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-50 border-gray-300 h-13 text-[15px] rounded-xl focus-visible:ring-[#F46F00] focus-visible:border-[#F46F00]"
                />
                <Input
                  type="tel"
                  required
                  placeholder="Phone Number..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-gray-50 border-gray-300 h-13 text-[15px] rounded-xl focus-visible:ring-[#F46F00] focus-visible:border-[#F46F00]"
                />
                <Input
                  type="text"
                  required
                  placeholder="Website URL... (e.g. yourbrand.com)"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="bg-gray-50 border-gray-300 h-13 text-[15px] rounded-xl focus-visible:ring-[#F46F00] focus-visible:border-[#F46F00]"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#F46F00] to-[#E34200] hover:from-[#E34200] hover:to-[#F46F00] text-white font-extrabold text-[15px] sm:text-[18px] py-4 sm:py-5 rounded-xl shadow-[0_6px_24px_rgba(244,111,0,0.35)] mt-4 transition-all duration-300 h-auto whitespace-normal leading-tight cursor-pointer disabled:opacity-75 flex justify-center items-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Securing Spot...
                    </>
                  ) : (
                    "RESERVE YOUR SPOT FOR FREE"
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-[11px] font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-green-600" /> Secure 256-bit Encrypted Registration
                </div>
              </form>
            </div>
          )}
        </div>

        <p className="w-full md:w-[1000px] text-center text-[12px] md:text-[14px] text-gray-500 mb-16 leading-relaxed font-medium px-4">
          By clicking the button above you agree to our Terms & Conditions and Privacy Policy.<br className="hidden md:block" />
          Your information is 100% secure and will not be shared.
        </p>

        <h3 className="text-[#1a202c] font-black text-[22px] sm:text-[28px] md:text-[36px] text-center mb-10 uppercase px-4 leading-tight max-w-[1000px] tracking-tight">
          Check Out The Results We Recently Got Another Streetwear Brand Owner Using The Same Process
        </h3>

        {/* ✨ PREMIUM CASE STUDIES GALLERY ✨ */}
        <div className="w-full md:w-[1100px] mb-14 px-4 md:px-0 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 30 Day Results */}
            <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col border border-gray-100 transition-all hover:shadow-2xl text-black">
              <div
                className="rounded-xl overflow-hidden relative group cursor-pointer bg-gray-50 flex items-center justify-center mb-5 border border-gray-100"
                onClick={() => setPreviewImage("/5.png")}
              >
                <Image
                  src="/5.png"
                  alt="30 day results"
                  width={1000}
                  height={1000}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-[#F46F00]/10 transition-colors duration-300 rounded-xl" />
              </div>
              <div className="px-1 text-left flex-1 flex flex-col">
                <span className="text-[11px] font-black text-[#F46F00] uppercase tracking-widest mb-1 block">30 DAY RESULTS</span>
                <h4 className="font-extrabold text-[18px] md:text-[20px] text-gray-900 leading-tight mb-4">
                  We helped a streetwear brand owner sell 153 hoodies in 30 days with one viral ad.
                </h4>
                <p className="text-[13px] md:text-[14px] text-gray-800 font-bold mb-2">SUMMARY</p>
                <ul className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-medium space-y-1 mb-4">
                  <li>• Daily Ad Spend: ~$30/day</li>
                  <li>• Total Ad Spend: $965</li>
                  <li>• Average Order Value: $50</li>
                  <li>• Units Sold: 153 Hoodies</li>
                  <li>• Total Revenue Generated: $7,650</li>
                  <li>• Cash Remaining After Ad Spend: $6,685</li>
                </ul>
                <p className="text-[13px] md:text-[14px] text-gray-800 font-bold mb-2">CONCLUSION</p>
                <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-medium mb-3">
                  Instead of relying on luck, endless content creation, or guessing what might work, the brand used a single viral ad to generate enough demand to sell 153 hoodies in 30 days while spending only $965 on advertising.
                </p>
                <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-medium mb-3">
                  This generated the cash flow needed to fund future growth from the brand's own profits—without relying on loans, investors, or risky financial decisions.
                </p>
                <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-medium">
                  Thanks to the additional cash flow, the brand was able to reinvest into the business, delegate responsibilities, and spend more time focusing on growth rather than handling every task alone.
                </p>
              </div>
            </div>

            {/* Long Term Results */}
            <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col border border-gray-100 transition-all hover:shadow-2xl text-black">
              <div
                className="rounded-xl overflow-hidden relative group cursor-pointer bg-gray-50 flex items-center justify-center mb-5 border border-gray-100"
                onClick={() => setPreviewImage("/3.png")}
              >
                <Image
                  src="/3.png"
                  alt="long term results"
                  width={1000}
                  height={1000}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-[#F46F00]/10 transition-colors duration-300 rounded-xl" />
              </div>
              <div className="px-1 text-left flex-1 flex flex-col">
                <span className="text-[11px] font-black text-[#F46F00] uppercase tracking-widest mb-1 block">LONG TERM RESULTS</span>
                <h4 className="font-extrabold text-[18px] md:text-[20px] text-gray-900 leading-tight mb-4">
                  We helped the streetwear brand convert the profits into $1.2 million in the next 15 months.
                </h4>
                <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-medium mb-4">
                  Instead of withdrawing the profits, the brand reinvested the cash flow generated from the viral ad back into larger advertising campaigns.
                </p>
                <p className="text-[13px] md:text-[14px] text-gray-800 font-bold mb-3">This Success Allowed The Brand To:</p>
                <ul className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-medium space-y-2 flex-1">
                  <li className="pl-4 relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#F46F00] before:rounded-full before:absolute before:left-0 before:top-2">
                    Generate 50,000+ orders over a 2-year period
                  </li>
                  <li className="pl-4 relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#F46F00] before:rounded-full before:absolute before:left-0 before:top-2">
                    Build an in-house manufacturing team that provided stable employment opportunities
                  </li>
                  <li className="pl-4 relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#F46F00] before:rounded-full before:absolute before:left-0 before:top-2">
                    Pay designers a full-time income
                  </li>
                  <li className="pl-4 relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#F46F00] before:rounded-full before:absolute before:left-0 before:top-2">
                    Establish long-term partnerships with shipping providers
                  </li>
                  <li className="pl-4 relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#F46F00] before:rounded-full before:absolute before:left-0 before:top-2">
                    Become an official merchandise partner for the video game franchise Assassin's Creed
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={scrollToForm}
          className="w-full md:w-[900px] bg-gradient-to-r from-[#F46F00] to-[#E34200] hover:from-[#E34200] hover:to-[#F46F00] text-white font-black text-[18px] sm:text-[22px] py-6 sm:py-8 rounded-2xl shadow-[0_10px_30px_rgba(244,111,0,0.3)] mb-20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] uppercase tracking-wider h-auto whitespace-normal leading-tight px-4 cursor-pointer"
        >
          RESERVE YOUR FREE SPOT
        </Button>

        {/* Footer */}
        <div className="w-full flex flex-col items-center text-center pb-8 border-t border-gray-200 pt-8 mt-auto">
          <p className="text-[12px] text-gray-500 max-w-[600px] leading-relaxed font-medium">
            Disclaimer: The results expressed in this training are illustrative and not guaranteed. Your success is entirely up to you and the work you put in.
          </p>
        </div>
      </div>

      {/* Image Preview Overlay */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
            aria-label="Close preview"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
