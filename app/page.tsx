"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";
import { fbEvent } from "@/components/FacebookPixel";

// Reusable SVG for the solid blue checkmark seen in the image
const CheckIcon = () => (
  <svg className="w-5 h-5 text-[#1877f2] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

export default function WorkshopLandingPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [visitorCount, setVisitorCount] = useState(0);

  // Track visitor on mount
  useEffect(() => {
    fetch("/api/visitors", { method: "POST" })
      .then(res => res.json())
      .then(data => setVisitorCount(data.count))
      .catch(() => { });
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById("register-form");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 32;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setStep(2);

    // 🔥 FB Pixel: Lead event — user completed the form
    fbEvent("Lead", {
      content_name: "Workshop Registration Form",
    });
  };

  const handleStripePayment = async () => {
    setLoading(true);
    setError("");

    try {
      // 🔥 FB Pixel: InitiateCheckout event
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

      // Redirect to Stripe Hosted Checkout
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      setLoading(false);
    }
  };
  // handleNextStep advances the form from step 1 → step 2

  return (
    <div className="min-h-screen bg-[#040B1A] text-white font-sans selection:bg-[#1877f2] selection:text-white pb-16">

      {/* Top Logo Container */}
      <div className="w-full flex justify-center pt-8 pb-4">
        <Image
          src="/logoMain.png"
          alt="Brand Logo"
          width={220}
          height={65}
          className="w-auto h-auto object-contain"
          priority
        />
      </div>

      <div className="max-w-[800px] mx-auto px-4 flex flex-col items-center">

        {/* Date / Time Badge */}
        <div className="w-full max-w-[600px] bg-[#1877f2] text-white font-bold text-[13px] md:text-[15px] py-2 rounded mb-4 text-center uppercase tracking-wide">
          FREE ONLINE MASTERCLASS — April 10, 2026 | 6:00 AM DUBAI (GST)
        </div>

        {/* Live Visitor Counter */}
        {visitorCount > 0 && (
          <div className="flex items-center gap-2 mb-6 text-[13px] text-gray-400 font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span><strong className="text-white">{visitorCount.toLocaleString()}</strong> people have viewed this page</span>
          </div>
        )}

        {/* Headline */}
        <h1 className="text-3xl md:text-[42px] font-bold text-center leading-[1.1] mb-8 text-[#f8fafc]">
          THE ULTIMATE SALES ENGINE FRAMEWORK: <br className="hidden md:block" />
          TRANSFORM YOUR CLOTHING BRAND INTO <br className="hidden md:block" />
          A PREDICTABLE REVENUE MACHINE IN 90 DAYS
        </h1>

        {/* Top CTA */}
        <Button
          onClick={scrollToForm}
          className="w-full md:w-[600px] bg-[#1877f2] hover:bg-[#1565c0] text-white font-bold text-[18px] md:text-[22px] py-7 md:py-8 rounded shadow-lg mb-10 transition-colors"
        >
          SECURE YOUR SPOT FOR JUST $97
        </Button>

        {/* What You Will Learn */}
        <div className="w-full md:w-[700px] mb-10">
          <h2 className="text-[20px] md:text-[24px] font-bold text-center mb-6 text-white">
            WHAT YOU WILL LEARN
          </h2>
          <ul className="space-y-4 text-[15px] md:text-[16px] text-gray-200">
            <li className="flex items-start gap-3">
              <CheckIcon />
              <p><strong>Predictable Revenue System:</strong> Discover how to generate consistent, scalable sales on demand that grow your clothing brand every month—without relying on unpredictable algorithms or trends.</p>
            </li>
            <li className="flex items-start gap-3">
              <CheckIcon />
              <p><strong>The AI Sales Engine Method:</strong> Learn the proven AI-powered sales engine that's helped a 6-figure fashion brand go from inconsistent results to predictable multi-6 and 7-figure growth within months.</p>
            </li>
            <li className="flex items-start gap-3">
              <CheckIcon />
              <p><strong>Fix Unstable ROAS:</strong> Finally overcome declining ROAS and inconsistent sales with a step-by-step system that works even if your ads have stopped converting or performance keeps dropping.</p>
            </li>
            <li className="flex items-start gap-3">
              <CheckIcon />
              <p><strong>Hidden Demand Control:</strong> Gain access to demand-generation strategies most fashion brand owners never discover—giving you the ability to control when and how your brand makes money.</p>
            </li>
            <li className="flex items-start gap-3">
              <CheckIcon />
              <p><strong>Plug-and-Play Execution:</strong> Walk away with 3 actionable systems and frameworks you can implement immediately to stabilize revenue and start scaling with confidence.</p>
            </li>
            <li className="flex items-start gap-3">
              <CheckIcon />
              <p><strong>Direct Expert Guidance:</strong> Learn from a system backed by 2000+ brand consultations and $15M+ generated, so you can scale your brand with clarity—without guesswork or costly mistakes.</p>
            </li>
            <li className="flex items-start gap-3">
              <CheckIcon />
              <p><strong>Eliminate Scaling Risk:</strong> Remove the fear of scaling ads and losing profitability, so you can grow aggressively with confidence, knowing your system is stable and repeatable.</p>
            </li>
          </ul>
        </div>

        {/* Mid CTA */}
        <Button
          onClick={scrollToForm}
          className="w-full md:w-[600px] bg-[#1877f2] hover:bg-[#1565c0] text-white font-bold text-[18px] md:text-[22px] py-7 md:py-8 rounded shadow-lg mb-6"
        >
          ATTEND FOR JUST $97
        </Button>

        {/* Note Box */}
        <div className="w-full md:w-[700px] bg-white text-black p-4 md:p-5 rounded-sm shadow-md mb-6 border border-gray-200">
          <p className="text-[13px] md:text-[14px] leading-relaxed text-center font-medium">
            <span className="text-[#ef4444] font-bold">NOTE:</span> This workshop is priced at $97 for fashion brand owners who are serious about scaling profitably and stepping into a true leadership role. The framework is built on years of experience and proven results across dozens of brands.
          </p>
        </div>

        {/* Forms Container */}
        <div id="register-form" className="w-full md:w-[700px] bg-white rounded-md shadow-2xl mb-2 overflow-hidden text-black pt-1">
          {success ? (
            <div className="p-10 text-center flex flex-col items-center">
              <CheckIcon />
              <h3 className="text-2xl font-bold mt-4">Registration Complete</h3>
              <p className="text-gray-600 mt-2">Check your email for the next steps.</p>
            </div>
          ) : (
            <>
              {/* Stepper Tabs */}
              <div className="flex w-full mb-6 mt-2 px-2 transition-all duration-500">
                <div className={`w-1/2 flex flex-col items-center ${step === 2 && 'opacity-40 cursor-pointer'}`} onClick={() => step === 2 && setStep(1)}>
                  <span className="text-[12px] font-bold text-[#1877f2] mb-1">Step 1</span>
                  <span className="text-[14px] font-bold text-[#1877f2] mb-2">Your details</span>
                  <div className="w-full h-1 bg-[#1877f2] relative">
                    {step === 1 && <div className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-[#1877f2]" />}
                  </div>
                </div>
                <div className={`w-1/2 flex flex-col items-center ${step === 1 && 'opacity-40'}`}>
                  <span className="text-[12px] font-bold text-[#1877f2] mb-1">Step 2</span>
                  <span className="text-[14px] font-bold text-[#1877f2] mb-2">Secure your spot</span>
                  <div className="w-full h-1 bg-[#1877f2] relative">
                    {step === 2 && <div className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-[#1877f2]" />}
                  </div>
                </div>
              </div>

              {error && <div className="mx-6 text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded mb-4">{error}</div>}

              {/* Step Flow Container */}
              <div className="relative w-full overflow-hidden">
                <div className="flex w-[200%] transition-transform duration-500 ease-in-out" style={{ transform: `translateX(${step === 1 ? '0%' : '-50%'})` }}>

                  {/* STEP 1: Details */}
                  <form onSubmit={handleNextStep} className="w-1/2 px-6 md:px-12 pb-8 flex flex-col space-y-4 shrink-0">
                    <Input
                      required
                      placeholder="Full Name..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-gray-50 border-gray-300 h-12 text-[15px] focus-visible:ring-[#1877f2]"
                    />
                    <Input
                      type="email"
                      required
                      placeholder="Email Address..."
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-gray-50 border-gray-300 h-12 text-[15px] focus-visible:ring-[#1877f2]"
                    />
                    <Input
                      type="tel"
                      required
                      placeholder="Phone Number..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-gray-50 border-gray-300 h-12 text-[15px] focus-visible:ring-[#1877f2]"
                    />
                    <Button
                      type="submit"
                      className="w-full bg-[#1877f2] hover:bg-[#1565c0] text-white font-bold text-[18px] md:text-[22px] py-7 md:py-8 rounded shadow-lg mt-4 transition-all"
                    >
                      SECURE YOUR SPOT
                    </Button>
                    <p className="text-center text-[11px] text-gray-400 mt-2 italic font-medium">Continue to secure 256-bit encrypted checkout.</p>
                  </form>

                  {/* STEP 2: Checkout box */}
                  <div className="w-1/2 px-6 md:px-12 pb-8 flex flex-col items-center shrink-0">
                    <div className="w-full bg-slate-50 border border-gray-200 rounded-lg p-5 mb-6 shadow-inner">
                      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
                        <span className="font-bold text-gray-800">Workshop Ticket</span>
                        <span className="font-bold text-[#1877f2] text-xl">$97.00</span>
                      </div>
                      <div className="text-[13px] text-gray-600 space-y-2">
                        <div className="flex justify-between"><span className="font-semibold text-gray-400">Name:</span> <span>{formData.name || "-"}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-gray-400">Email:</span> <span>{formData.email || "-"}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-gray-400">Total Due:</span> <span className="font-bold text-black">$97.00</span></div>
                      </div>
                    </div>

                    <Button
                      onClick={handleStripePayment}
                      disabled={loading}
                      className="w-full bg-[#111827] hover:bg-[#1f2937] text-white font-bold text-[18px] md:text-[22px] py-7 md:py-8 rounded shadow-xl transition-all flex justify-center items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Redirecting to Stripe...
                        </>
                      ) : (
                        "Pay with Stripe"
                      )}
                    </Button>
                    <div className="flex items-center gap-2 mt-4 text-gray-400 text-[11px] font-medium">
                      <span>Secured by</span>
                      <span className="font-bold text-gray-700 tracking-wider">stripe</span>
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}
        </div>

        <p className="w-full md:w-[650px] text-center text-[10px] text-gray-400 mb-10 leading-relaxed font-medium px-4">
          By clicking the button above you agree to our Terms & Conditions and Privacy Policy.<br className="hidden md:block" />
          Your information is 100% secure and will not be shared.
        </p>

        {/* Large White Block */}
        <div className="w-full md:w-[700px] bg-white text-black p-8 md:p-12 rounded-md shadow-2xl mb-12 flex flex-col items-center">

          <h2 className="text-[26px] md:text-[32px] font-extrabold mb-8 text-center tracking-tight">
            HOW IT WORKS
          </h2>

          <div className="w-full max-w-[500px] mb-12 pl-2">
            <ol className="list-decimal pl-5 space-y-4 text-[15px] md:text-[16px] font-medium text-gray-800">
              <li className="pl-2">Register now and receive access details (materials/links/training access) directly in your inbox.</li>
              <li className="pl-2">Participate in live Q&A session where you can ask questions and secure an optimal answer.</li>
              <li className="pl-2">Apply what you learn and immediately see a resulting improve dramatically.</li>
            </ol>
          </div>

          <h2 className="text-[22px] md:text-[26px] font-extrabold mb-6 text-center tracking-tight">
            YOUR DECISION IS <br className="md:hidden" /> RISK-FREE
          </h2>

          {/* Worst Case */}
          <div className="w-full max-w-[550px] mb-6 border border-red-100 rounded overflow-hidden shadow-sm">
            <div className="bg-[#ef4444] text-white font-extrabold text-[18px] md:text-[22px] text-center py-2.5 tracking-wide">
              WORST CASE SCENARIO:
            </div>
            <div className="p-5 md:p-6 bg-white text-center">
              <p className="text-[#ef4444] font-bold text-[14px] md:text-[15px] mb-3">
                You attend the workshop, decide it's not for you, and contact us within 24 hours.
              </p>
              <p className="text-[13px] md:text-[14px] text-gray-700 leading-relaxed font-medium">
                Simply contact us at <strong>Yasir.sultan@zenfocusmedia.com</strong> within 24 hours and we'll process your refund—no questions asked, no hard feelings.
              </p>
            </div>
          </div>

          {/* Best Case */}
          <div className="w-full max-w-[550px] mb-8 border border-green-100 rounded overflow-hidden shadow-sm">
            <div className="bg-[#22c55e] text-white font-extrabold text-[18px] md:text-[22px] text-center py-2.5 tracking-wide">
              BEST CASE SCENARIO:
            </div>
            <div className="p-5 md:p-6 bg-white text-center">
              <p className="text-black font-bold text-[14px] md:text-[15px] mb-3">
                You apply what you learn and achieve predictable, scalable 7-figure months that far exceed your small investment of $97.
              </p>
              <p className="text-[13px] md:text-[14px] text-gray-700 leading-relaxed font-medium mb-3">
                Many participants report doubling their revenue within just a few months, making this potentially the most valuable hour you'll spend on growing your brand this year.
              </p>
              <p className="text-[#ef4444] font-bold text-[13px] md:text-[14px] leading-relaxed">
                The Only Risk? <span className="text-black font-medium">Missing out on the knowledge and strategies that could transform your business, revenue, and lifestyle.</span>
              </p>
            </div>
          </div>

          {/* Internal CTA */}
          <Button
            onClick={scrollToForm}
            className="w-full md:w-[500px] bg-[#1877f2] hover:bg-[#1565c0] text-white font-bold text-[18px] md:text-[20px] py-7 rounded shadow-md mt-4"
          >
            RESERVE YOUR PLACE NOW FOR $97
          </Button>
        </div>

        {/* P.S. Section */}
        <h3 className="text-[#1877f2] font-bold text-[18px] md:text-[22px] text-center mb-8 uppercase px-4 leading-tight max-w-[650px]">
          P.S. HERE'S SOME FACTS ABOUT US AND WHY YOU SHOULD ATTEND THIS WORKSHOP…
        </h3>

        {/* ✨ PREMIUM MASONRY GALLERY ✨ */}
        <div className="w-full md:w-[700px] mb-8 px-4 md:px-0">

          {/* Featured top row: image 1 large left + image 6 portrait right */}
          <div className="flex gap-4 mb-4">
            {/* Large feature card */}
            <div className="flex-[2] bg-white rounded-2xl shadow-xl p-3 flex flex-col">
              <div className="rounded-xl overflow-hidden relative group" style={{ minHeight: "200px" }}>
                <Image
                  src="/1.jpeg"
                  alt="Social proof 1"
                  width={450}
                  height={280}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ minHeight: "200px" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </div>
              <p className="font-extrabold text-[14px] text-black mt-2.5 px-1">Social proof image 1 👍</p>
            </div>

            {/* Portrait card */}
            <div className="flex-[1] bg-white rounded-2xl shadow-xl p-3 flex flex-col">
              <div className="rounded-xl overflow-hidden relative group flex-1" style={{ minHeight: "200px" }}>
                <Image
                  src="/6.jpeg"
                  alt="Social proof 6"
                  width={220}
                  height={280}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ minHeight: "200px" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </div>
              <p className="font-extrabold text-[14px] text-black mt-2.5 px-1">Social proof image 6 👍</p>
            </div>
          </div>

          {/* Middle row: 3 square cards */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[{ src: "/2.png", n: 2 }, { src: "/3.png", n: 3 }, { src: "/4.jpeg", n: 4 }].map(({ src, n }) => (
              <div key={n} className="bg-white rounded-2xl shadow-xl p-3 flex flex-col">
                <div className="rounded-xl overflow-hidden relative group aspect-square">
                  <Image
                    src={src}
                    alt={`Social proof ${n}`}
                    width={220}
                    height={220}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </div>
                <p className="font-extrabold text-[13px] text-black mt-2 px-1">Social proof image {n} 👍</p>
              </div>
            ))}
          </div>

          {/* Bottom: full-width panoramic card */}
          <div className="bg-white rounded-2xl shadow-xl p-3">
            <div className="rounded-xl overflow-hidden relative group" style={{ height: "170px" }}>
              <Image
                src="/5.jpeg"
                alt="Social proof 5"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="700px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </div>
            <p className="font-extrabold text-[14px] text-black mt-2.5 px-1">Social proof image 5 👍</p>
          </div>

        </div>

        {/* Final CTA */}
        <Button
          onClick={scrollToForm}
          className="w-full md:w-[500px] bg-[#1877f2] hover:bg-[#1565c0] text-white font-bold text-[18px] md:text-[20px] py-7 md:py-8 rounded shadow-lg mb-16"
        >
          RESERVE YOUR PLACE NOW FOR $97
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
    </div>
  );
}
