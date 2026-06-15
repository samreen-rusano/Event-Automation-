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
    <div className="min-h-screen bg-[#162228] text-[#f8fafc] font-sans selection:bg-[#F46F00] selection:text-white pb-16">
      {/* Top Logo Container */}
      <div className="w-full flex justify-center pt-8 pb-4">
        <Image
          src="/logoMain.png"
          alt="Brand Logo"
          width={220}
          height={65}
          className="w-auto h-auto object-contain filter brightness-110"
          priority
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col items-center">
        {/* Date Banner */}
        <div className="w-full max-w-[1000px] bg-gradient-to-r from-[#F46F00] to-[#E34200] text-white font-extrabold text-[12px] sm:text-[14px] md:text-[18px] py-3 px-4 rounded-xl mb-6 text-center uppercase tracking-wider shadow-lg leading-tight animate-pulse">
          ONLINE MASTERCLASS - JUNE 25, 2026 | 3PM EST (TORONTO)
        </div>

        {/* Live Visitor Counter */}
        {visitorCount > 0 && (
          <div className="flex items-center gap-2 mb-6 text-[13px] text-gray-300 font-medium bg-[#45606D]/30 px-4 py-1.5 rounded-full border border-gray-500/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span><strong className="text-white">{visitorCount.toLocaleString()}</strong> times people have viewed this page</span>
          </div>
        )}

        {/* Headline & Subheadline */}
        <div className="text-center w-full max-w-[1000px] mb-8 md:mb-12">
          <h1 className="text-[28px] sm:text-4xl md:text-[52px] font-black leading-[1.15] text-[#f8fafc] tracking-tight">
            <span className="block mb-4 text-[#F46F00] uppercase tracking-normal">
              How We Helped A Streetwear Brand Sell 153 Hoodies In 30 Days With One Viral Ad
            </span>
          </h1>
          <p className="text-[17px] sm:text-[20px] md:text-[24px] font-normal text-gray-300 leading-relaxed max-w-[850px] mx-auto border-t border-gray-700/50 pt-6">
            Discover The One Viral Ad Framework That Helped A Streetwear Brand Sell 153 Hoodies And Generate $7,650 In Sales In Just 30 Days With Only $965 In Ad Spend.
          </p>
        </div>

        {/* Top CTA */}
        <Button
          type="button"
          onClick={() => {
            trackScrollCtaClick("top");
            scrollToForm();
          }}
          className="w-full md:w-[900px] bg-gradient-to-r from-[#F46F00] to-[#E34200] hover:from-[#E34200] hover:to-[#F46F00] text-white font-black text-[16px] sm:text-[20px] md:text-[24px] py-5 sm:py-7 md:py-9 rounded-2xl shadow-[0_10px_30px_rgba(244,111,0,0.3)] mb-14 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] uppercase tracking-wider h-auto whitespace-normal leading-tight px-4 cursor-pointer"
        >
          ATTEND FOR FREE
        </Button>

        {/* What You Will Learn */}
        <div className="w-full md:max-w-[1000px] mx-auto mb-16 px-4 py-8 bg-[#45606D]/10 rounded-2xl border border-gray-700/30 backdrop-blur-sm">
          <h2 className="text-[24px] sm:text-[28px] md:text-[36px] font-black text-center mb-10 text-white tracking-tight flex items-center justify-center gap-3">
            <Sparkles className="text-[#F46F00] w-6 h-6 md:w-8 md:h-8" /> WHAT YOU'LL LEARN
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[15px] sm:text-[17px] md:text-[18px] text-gray-200 leading-[1.6]">
            {/* Learn Block 1 */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-[#162228]/50 border border-gray-700/20 hover:border-[#F46F00]/30 transition-all duration-300">
              <BulletIcon num={1} />
              <div>
                <p className="text-gray-300 text-[14px] md:text-[15px]">
                  <strong>Discover How To Create One Viral Ad</strong> That Sells Out Your Next Drop In 30 Days Without Wasting Money On Guesswork.
                </p>
              </div>
            </div>

            {/* Learn Block 2 */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-[#162228]/50 border border-gray-700/20 hover:border-[#F46F00]/30 transition-all duration-300">
              <BulletIcon num={2} />
              <div>
                <p className="text-gray-300 text-[14px] md:text-[15px]">
                  <strong>Learn the proven One Viral Ad Method</strong> that helped a streetwear brand generate $7,650 in sales from just $965 in ad spend in 30 days.
                </p>
              </div>
            </div>

            {/* Learn Block 3 */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-[#162228]/50 border border-gray-700/20 hover:border-[#F46F00]/30 transition-all duration-300">
              <BulletIcon num={3} />
              <div>
                <p className="text-gray-300 text-[14px] md:text-[15px]">
                  <strong>Finally overcome inconsistent sales</strong> with a step-by-step process that works even if you have no audience and limited budget.
                </p>
              </div>
            </div>

            {/* Learn Block 4 */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-[#162228]/50 border border-gray-700/20 hover:border-[#F46F00]/30 transition-all duration-300">
              <BulletIcon num={4} />
              <div>
                <p className="text-gray-300 text-[14px] md:text-[15px]">
                  <strong>Learn the hidden psychology behind viral ads</strong> that most streetwear founders never discover—giving you a significant advantage over your competition.
                </p>
              </div>
            </div>

            {/* Learn Block 5 */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-[#162228]/50 border border-gray-700/20 hover:border-[#F46F00]/30 transition-all duration-300">
              <BulletIcon num={5} />
              <div>
                <p className="text-gray-300 text-[14px] md:text-[15px]">
                  <strong>Walk away with the 7-Step One Viral Ad Framework</strong> you can implement in just 60 minutes to sell out your next drop in 30 days.
                </p>
              </div>
            </div>

            {/* Learn Block 6 */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-[#162228]/50 border border-gray-700/20 hover:border-[#F46F00]/30 transition-all duration-300">
              <BulletIcon num={6} />
              <div>
                <p className="text-gray-300 text-[14px] md:text-[15px]">
                  <strong>Benefit from analyzing over 10,000 e-commerce ads</strong> as you learn exactly what generates qualified attention—and what to avoid—to create a viral ad that sells out your next drop.
                </p>
              </div>
            </div>

            {/* Learn Block 7 */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-[#162228]/50 border border-gray-700/20 hover:border-[#F46F00]/30 transition-all duration-300 md:col-span-2">
              <BulletIcon num={7} />
              <div>
                <p className="text-gray-300 text-[14px] md:text-[15px]">
                  <strong>Eliminate the fear of wasting money on ads that don't work</strong> by learning how to find a viral ad that sells out your next drop profitably.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mid CTA */}
        <Button
          type="button"
          onClick={() => {
            trackScrollCtaClick("middle");
            scrollToForm();
          }}
          className="w-full md:w-[900px] bg-gradient-to-r from-[#F46F00] to-[#E34200] hover:from-[#E34200] hover:to-[#F46F00] text-white font-black text-[16px] sm:text-[20px] md:text-[24px] py-5 sm:py-7 md:py-9 rounded-2xl shadow-[0_10px_30px_rgba(244,111,0,0.3)] mb-10 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] uppercase tracking-wider h-auto whitespace-normal leading-tight px-4 cursor-pointer"
        >
          ATTEND FOR FREE
        </Button>

        {/* Note Box */}
        <div className="w-full md:w-[1000px] bg-[#162228] border-2 border-dashed border-[#F46F00]/60 p-6 md:p-8 rounded-2xl shadow-xl mb-12 backdrop-blur-md">
          <p className="text-[15px] md:text-[18px] leading-relaxed text-center text-gray-200">
            <span className="text-[#F46F00] font-black tracking-wide uppercase mr-2">NOTE:</span> This workshop is FREE for streetwear brand owners who are serious about selling out their next drop without guesswork, endless content creation, or wasting money on ads that don't work.
            <br className="hidden md:block" />
            <br className="hidden md:block" />
            The framework is built on years of experience and proven results across dozens of brands.
          </p>
        </div>

        {/* Forms Container */}
        <div id="register-form" className="w-full md:w-[1100px] bg-white rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.3)] mb-8 overflow-hidden text-black border border-gray-100 transition-all duration-500">
          {success ? (
            <div className="p-8 sm:p-12 text-center flex flex-col items-center max-w-[850px] mx-auto bg-white">
              <div className="w-20 h-20 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mb-6 shadow-md">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">SUCCESS – YOU'RE REGISTERED!</h3>
              <p className="text-gray-600 text-[16px] mb-8 font-medium">Check your email for the next steps and preparation checklist.</p>

              <div className="w-full bg-[#162228] text-white rounded-xl shadow-inner mb-8 overflow-hidden border border-gray-800 text-left">
                <div className="bg-gradient-to-r from-[#F46F00] to-[#E34200] text-white font-extrabold text-[13px] md:text-[15px] py-3.5 px-6 uppercase tracking-wider text-center">
                  IMPORTANT ACCESS DETAILS
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  {/* Card 1 */}
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#F46F00]" />
                    </div>
                    <div>
                      <p className="font-bold text-[15px] text-white mb-1">1. Check Your Email</p>
                      <p className="text-[13px] text-gray-300 leading-relaxed">
                        Your access instructions and calendar invite have been dispatched. Check your inbox (and spam/promotions folder just in case).
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center">
                      <Video className="w-5 h-5 text-[#F46F00]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[15px] text-white mb-1">2. Secure Google Meet Credentials</p>
                      <p className="text-[13px] text-gray-300 leading-relaxed mb-3">
                        The workshop is live on Google Meet. Join the link directly on your calendar or below:
                      </p>
                      <div className="bg-[#162228]/80 border border-gray-700/50 p-4 rounded-lg space-y-3">
                        <div className="text-[13px] text-gray-300 space-y-1">
                          <p><strong>Topic:</strong> {MEET_DETAILS.topic}</p>
                          <p><strong>Time:</strong> {MEET_DETAILS.time}</p>
                          <p><strong>Dial In:</strong> {MEET_DETAILS.dialIn}</p>
                        </div>
                        <a
                          href={MEET_DETAILS.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-[#F46F00] hover:bg-[#E34200] text-white font-bold text-[13px] px-5 py-2.5 rounded shadow transition-all duration-300"
                        >
                          Join Google Meet <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center">
                      <CalendarCheck className="w-5 h-5 text-[#F46F00]" />
                    </div>
                    <div>
                      <p className="font-bold text-[15px] text-white mb-1">3. Lock It In Your Calendar</p>
                      <p className="text-[13px] text-gray-300 leading-relaxed">
                        Block out **June 25, 2026 at 3:00 PM EST (Toronto)**. Real results require full presence. Ensure you attend live for the interactive Q&A session.
                      </p>
                    </div>
                  </div>
                </div>
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

        <p className="w-full md:w-[1000px] text-center text-[12px] md:text-[14px] text-gray-400 mb-16 leading-relaxed font-medium px-4">
          By clicking the button above you agree to our Terms & Conditions and Privacy Policy.<br className="hidden md:block" />
          Your information is 100% secure and will not be shared.
        </p>

        {/* HOW IT WORKS */}
        <div className="w-full md:max-w-[1000px] mx-auto mb-16 px-4 py-8 bg-[#45606D]/10 rounded-2xl border border-gray-700/30 backdrop-blur-sm">
          <h2 className="text-[24px] sm:text-[28px] md:text-[36px] font-black text-center mb-10 text-white tracking-tight flex items-center justify-center gap-3">
            HOW IT WORKS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-[15px] sm:text-[17px] text-gray-200">
            <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-[#162228]/50 border border-gray-700/20 hover:border-[#F46F00]/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-[#F46F00] to-[#E34200] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">1</div>
              <p className="font-semibold text-gray-300">Register now and receive access details. Can't make it live? A replay will be available for 48 hours.</p>
            </div>
            <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-[#162228]/50 border border-gray-700/20 hover:border-[#F46F00]/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-[#F46F00] to-[#E34200] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">2</div>
              <p className="font-semibold text-gray-300">Participate in the interactive session where you can ask questions and get personalized insights.</p>
            </div>
            <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-[#162228]/50 border border-gray-700/20 hover:border-[#F46F00]/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-[#F46F00] to-[#E34200] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">3</div>
              <p className="font-semibold text-gray-300">Apply what you learn and watch as your results improve dramatically.</p>
            </div>
          </div>
        </div>

        {/* YOUR DECISION IS RISK-FREE */}
        <div className="w-full md:w-[1100px] bg-white text-black p-6 sm:p-10 md:p-16 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.3)] mb-16 flex flex-col items-center border border-gray-100">
          <h2 className="text-[26px] md:text-[38px] font-black mb-4 text-center tracking-tight text-gray-900 uppercase">
            YOUR DECISION IS RISK-FREE
          </h2>
          <p className="text-gray-500 text-[15px] sm:text-[17px] mb-12 text-center font-medium max-w-[650px]">
            Here is a realistic look at the trade-off of spending an hour with us:
          </p>

          <div className="w-full max-w-[900px] space-y-8">
            {/* Worst Case */}
            <div className="border border-red-200 rounded-2xl overflow-hidden shadow-md">
              <div className="bg-[#ef4444] text-white font-black text-[15px] sm:text-[18px] md:text-[21px] text-center py-3 tracking-wider px-4 uppercase">
                Worst Case Scenario
              </div>
              <div className="p-6 sm:p-8 bg-white text-center">
                <p className="text-gray-800 text-[15px] md:text-[18px] leading-relaxed font-semibold">
                  You spend an hour with us and walk away with a clearer understanding of why your drops aren't generating the demand you expected—and a practical framework you can apply to your next launch.
                </p>
              </div>
            </div>

            {/* Best Case */}
            <div className="border border-green-200 rounded-2xl overflow-hidden shadow-md">
              <div className="bg-[#22c55e] text-white font-black text-[15px] sm:text-[18px] md:text-[21px] text-center py-3 tracking-wider px-4 uppercase">
                Best Case Scenario
              </div>
              <div className="p-6 sm:p-8 bg-white text-center">
                <p className="text-gray-800 text-[15px] md:text-[18px] leading-relaxed font-semibold">
                  You discover how to create a viral ad capable of selling out your next drop, generating the cash flow needed to fund future collections and grow your brand without relying on luck or guesswork.
                </p>
              </div>
            </div>

            {/* The Only Risk */}
            <div className="border border-amber-300 rounded-2xl overflow-hidden shadow-md">
              <div className="bg-[#F59E0B] text-white font-black text-[15px] sm:text-[18px] md:text-[21px] text-center py-3 tracking-wider px-4 uppercase">
                The Only Risk?
              </div>
              <div className="p-6 sm:p-8 bg-white text-center">
                <p className="text-gray-800 text-[15px] md:text-[18px] leading-relaxed font-semibold">
                  Launching another drop without a proven framework to identify winning ad ideas before you spend money testing them.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* P.S. Header */}
        <h3 className="text-[#F46F00] font-black text-[18px] sm:text-[24px] md:text-[32px] text-center mb-12 uppercase px-4 leading-tight max-w-[1000px] tracking-tight">
          P.S. HERE'S SOME FACTS ABOUT US AND WHY YOU SHOULD ATTEND THIS WORKSHOP...
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

        {/* Final CTA */}
        <Button
          type="button"
          onClick={scrollToForm}
          className="w-full md:w-[900px] bg-gradient-to-r from-[#F46F00] to-[#E34200] hover:from-[#E34200] hover:to-[#F46F00] text-white font-black text-[16px] sm:text-[20px] md:text-[24px] py-5 sm:py-7 md:py-9 rounded-2xl shadow-[0_10px_30px_rgba(244,111,0,0.3)] mb-20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] uppercase tracking-wider h-auto whitespace-normal leading-tight px-4 cursor-pointer"
        >
          RESERVE YOUR SPOT FOR FREE
        </Button>

        {/* Footer */}
        <div className="w-full flex flex-col items-center text-center pb-8 border-t border-gray-800 pt-8 mt-auto">
          <Image
            src="/logoMain.png"
            alt="Brand Logo"
            width={160}
            height={50}
            className="w-auto h-auto object-contain mb-4 opacity-80"
          />
          <p className="text-[10px] text-gray-500 max-w-[600px] leading-relaxed">
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
