"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, X } from "lucide-react";
import { fbEvent } from "@/components/FacebookPixel";

// Reusable SVG for the solid blue checkmark seen in the image
const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col items-center">

        <div className="w-full max-w-[1000px] bg-[#1877f2] text-white font-bold text-[11px] sm:text-[13px] md:text-[17px] py-2.5 sm:py-3 px-2 rounded mb-6 text-center uppercase tracking-wide shadow-md leading-tight">
          FREE ONLINE MASTERCLASS — April 14, 2026 | 8pm New York time (EST)
        </div>

        {/* Live Visitor Counter */}
        {visitorCount > 0 && (
          <div className="flex items-center gap-2 mb-6 text-[13px] text-gray-400 font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span><strong className="text-white">{visitorCount.toLocaleString()}</strong> times people have viewed this page</span>
          </div>
        )}

        {/* Headline */}
        <h1 className="text-[28px] sm:text-3xl md:text-[50px] font-extrabold text-center leading-[1.1] mb-8 md:mb-10 text-[#f8fafc] tracking-tight w-full max-w-[950px]">
          <span className="block mb-3 md:mb-5 text-[#1877f2]">
            THE ULTIMATE SALES ENGINE FRAMEWORK:
          </span>
          TRANSFORM YOUR CLOTHING BRAND INTO <br className="hidden md:block" />
          A PREDICTABLE REVENUE MACHINE IN 90 DAYS
        </h1>

        {/* Top CTA */}
        <Button
          onClick={scrollToForm}
          className="w-full md:w-[900px] bg-[#1877f2] hover:bg-[#1565c0] text-white font-extrabold text-[14px] sm:text-[17px] md:text-[22px] py-4 sm:py-6 md:py-8 rounded shadow-2xl mb-14 transition-all hover:scale-[1.02] uppercase tracking-wide h-auto whitespace-normal leading-tight px-4"
        >
          SECURE YOUR SPOT FOR JUST $97
        </Button>

        {/* What You Will Learn */}
        <div className="w-full md:max-w-[1000px] mx-auto mb-14 px-4">
          <h2 className="text-[22px] sm:text-[26px] md:text-[32px] font-extrabold text-center mb-8 text-white tracking-tight">
            WHAT YOU WILL LEARN
          </h2>

          <ul className="space-y-5 md:space-y-6 text-[16px] sm:text-[18px] md:text-[21px] text-gray-200 leading-[1.7]">

            <li className="flex items-start gap-3">
              <div className="mt-1 shrink-0">
                <CheckIcon />
              </div>
              <p>
                <strong className="text-green-500">Predictable Revenue System:</strong> Discover how to generate consistent, scalable sales on demand that grow your clothing brand every month—without relying on unpredictable algorithms or trends.
              </p>
            </li>

            <li className="flex items-start gap-3">
              <div className="mt-1 shrink-0">
                <CheckIcon />
              </div>
              <p>
                <strong className="text-green-500">The AI Sales Engine Method:</strong> Learn the proven AI-powered sales engine that's helped a 6-figure fashion brand go from inconsistent results to predictable multi-6 and 7-figure growth within months.
              </p>
            </li>

            <li className="flex items-start gap-3">
              <div className="mt-1 shrink-0">
                <CheckIcon />
              </div>
              <p>
                <strong className="text-green-500">Fix Unstable ROAS:</strong> Finally overcome declining ROAS and inconsistent sales with a step-by-step system that works even if your ads have stopped converting or performance keeps dropping.
              </p>
            </li>

            <li className="flex items-start gap-3">
              <div className="mt-1 shrink-0">
                <CheckIcon />
              </div>
              <p>
                <strong className="text-green-500">Hidden Demand Control:</strong> Gain access to demand-generation strategies most fashion brand owners never discover—giving you the ability to control when and how your brand makes money.
              </p>
            </li>

            <li className="flex items-start gap-3">
              <div className="mt-1 shrink-0">
                <CheckIcon />
              </div>
              <p>
                <strong className="text-green-500">Plug-and-Play Execution:</strong> Walk away with 3 actionable systems and frameworks you can implement immediately to stabilize revenue and start scaling with confidence.
              </p>
            </li>

            <li className="flex items-start gap-3">
              <div className="mt-1 shrink-0">
                <CheckIcon />
              </div>
              <p>
                <strong className="text-green-500">Direct Expert Guidance:</strong> Learn from a system backed by 2000+ brand consultations and $15M+ generated, so you can scale your brand with clarity—without guesswork or costly mistakes.
              </p>
            </li>

            <li className="flex items-start gap-3">
              <div className="mt-1 shrink-0">
                <CheckIcon />
              </div>
              <p>
                <strong className="text-green-500">Eliminate Scaling Risk:</strong> Remove the fear of scaling ads and losing profitability, so you can grow aggressively with confidence, knowing your system is stable and repeatable.
              </p>
            </li>

          </ul>
        </div>

        {/* Mid CTA */}
        <Button
          onClick={scrollToForm}
          className="w-full md:w-[900px] bg-[#1877f2] hover:bg-[#1565c0] text-white font-extrabold text-[14px] sm:text-[17px] md:text-[22px] py-4 sm:py-6 md:py-8 rounded shadow-2xl mb-10 transition-all hover:scale-[1.02] uppercase tracking-wide h-auto whitespace-normal leading-tight px-4"
        >
          ATTEND FOR JUST $97
        </Button>

        {/* Note Box */}
        <div className="w-full md:w-[1000px] bg-white text-black p-6 md:p-8 rounded-sm shadow-xl mb-10 border border-gray-200">
          <p className="text-[15px] md:text-[18px] leading-relaxed text-center ">
            <span className="text-[#ef4444] font-bold">NOTE:</span> This workshop is priced at $97 for fashion brand owners who are serious about scaling profitably and stepping into a true leadership role. The framework is built on years of experience and proven results across dozens of brands.
          </p>
        </div>

        {/* Forms Container */}
        <div id="register-form" className="w-full md:w-[1100px] bg-white rounded-md shadow-[0_0_40px_rgba(255,255,255,0.05)] mb-6 overflow-hidden text-black pt-4">
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
                      className="w-full bg-[#1877f2] hover:bg-[#1565c0] text-white font-bold text-[14px] sm:text-[16px] md:text-[18px] py-3.5 sm:py-5 md:py-6 rounded shadow-lg mt-4 transition-all h-auto whitespace-normal leading-tight"
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
                      className="w-full bg-[#111827] hover:bg-[#1f2937] text-white font-bold text-[14px] sm:text-[16px] md:text-[18px] py-3.5 sm:py-5 md:py-6 rounded shadow-xl transition-all flex justify-center items-center gap-2 h-auto whitespace-normal leading-tight px-2"
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

        <p className="w-full md:w-[1000px] text-center text-[12px] md:text-[14px] text-gray-400 mb-14 leading-relaxed font-medium px-4">
          By clicking the button above you agree to our Terms & Conditions and Privacy Policy.<br className="hidden md:block" />
          Your information is 100% secure and will not be shared.
        </p>

        {/* Large White Block */}
        <div className="w-full md:w-[1100px] bg-white text-black p-6 sm:p-10 md:p-20 rounded-md shadow-[0_0_40px_rgba(255,255,255,0.05)] mb-16 flex flex-col items-center">

          <h2 className="text-[26px] md:text-[38px] font-black mb-10 text-center tracking-tight">
            HOW IT WORKS
          </h2>

          <div className="w-full max-w-[800px] mb-14 pl-2">
            <ol className="list-decimal pl-5 space-y-5 text-[16px] md:text-[20px] font-medium text-gray-800">
              <li className="pl-3">Register now and receice access details directly to your inbox. Can't make it live? A replay will be available for 48 hours.</li>
              <li className="pl-3">Participate in live Q&A session where you can ask questions and secure an optimal answer.</li>
              <li className="pl-3">Apply what you learn and immediately see a resulting improve dramatically.</li>
            </ol>
          </div>

          <h2 className="text-[22px] md:text-[30px] font-extrabold mb-8 text-center tracking-tight">
            YOUR DECISION IS <br className="md:hidden" /> RISK-FREE
          </h2>

          {/* Worst Case */}
          <div className="w-full max-w-[850px] mb-8 border border-red-100 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-[#ef4444] text-white font-extrabold text-[14px] sm:text-[17px] md:text-[22px] text-center py-2.5 md:py-3 tracking-wide px-2 h-auto whitespace-normal">
              WORST CASE SCENARIO:
            </div>
            <div className="p-4 sm:p-6 md:p-8 bg-white text-center">
              <p className="text-[#ef4444] font-bold text-[16px] md:text-[20px] mb-4">
                You attend the workshop, decide it's not for you, and contact us within 24 hours.
              </p>
              <p className="text-[15px] md:text-[18px] text-gray-700 leading-relaxed font-medium">
                Simply contact us at <strong>yasirsultan1992@gmail.com</strong> within 24 hours and we'll process your refund—no questions asked, no hard feelings.
              </p>
            </div>
          </div>

          {/* Best Case */}
          <div className="w-full max-w-[850px] mb-12 border border-green-100 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-[#22c55e] text-white font-extrabold text-[14px] sm:text-[17px] md:text-[22px] text-center py-2.5 md:py-3 tracking-wide px-2 h-auto whitespace-normal">
              BEST CASE SCENARIO:
            </div>
            <div className="p-4 sm:p-6 md:p-8 bg-white text-center">
              <p className="text-black font-bold text-[16px] md:text-[20px] mb-4">
                You apply what you learn and achieve predictable, scalable 7-figure months that far exceed your small investment of $97.
              </p>
              <p className="text-[15px] md:text-[18px] text-gray-700 leading-relaxed font-medium mb-4">
                Many participants report doubling their revenue within just a few months, making this potentially the most valuable hour you'll spend on growing your brand this year.
              </p>
              <p className="text-[#ef4444] font-bold text-[15px] md:text-[18px] leading-relaxed">
                The Only Risk? <span className="text-black font-medium">Missing out on the knowledge and strategies that could transform your business, revenue, and lifestyle.</span>
              </p>
            </div>
          </div>

          {/* Internal CTA */}
          <Button
            onClick={scrollToForm}
            className="w-full md:w-[800px] bg-[#1877f2] hover:bg-[#1565c0] text-white font-extrabold text-[14px] sm:text-[17px] md:text-[22px] py-4 sm:py-6 md:py-8 rounded shadow-xl mt-8 hover:scale-[1.02] transition-all h-auto whitespace-normal leading-tight px-4"
          >
            RESERVE YOUR PLACE NOW FOR $97
          </Button>
        </div>

        {/* P.S. Section */}
        <h3 className="text-[#1877f2] font-black text-[16px] sm:text-[20px] md:text-[30px] text-center mb-12 uppercase px-4 leading-tight max-w-[1000px] tracking-tight">
          P.S. HERE'S SOME FACTS ABOUT US AND WHY YOU SHOULD ATTEND THIS WORKSHOP...
        </h3>

        {/* ✨ PREMIUM MASONRY GALLERY ✨ */}
        <div className="w-full md:w-[1100px] mb-14 px-4 md:px-0 flex flex-col gap-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                id: 1,
                headline: "Over 100 Satisfied Clients and Counting",
                subheadline: "Includes: • 50+ Verified 5-Star Testimonials on Upwork • Top Rated in the top 3% of marketers • 10 Video Testimonials • Dozens of written text testimonials • $25M generated for clients in 15 different niches",
                src: "/1.png"
              },
              {
                id: 2,
                headline: "We Built an Automated AI Sales Engine for our Own marketing agency",
                subheadline: "This helped us: • Generate over $800K for my business at 80% profit margin ($200K/year) • Dozens of paying clients every year",
                src: "/2.png"
              }
            ].map(card => (
              <div key={card.id} className="bg-white rounded-2xl shadow-xl p-5 flex flex-col border border-gray-100 transition-all hover:shadow-2xl">
                <div
                  className="rounded-xl overflow-hidden relative group cursor-pointer bg-gray-50 flex-1 flex items-center justify-center mb-5 border border-gray-100"
                  onClick={() => setPreviewImage(card.src)}
                >
                  <Image
                    src={card.src}
                    alt={`Proof ${card.id}`}
                    width={1000}
                    height={1000}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-[#1877f2]/10 transition-colors duration-300 rounded-xl" />
                </div>
                <div className="px-1 text-left">
                  <h4 className="font-extrabold text-[16px] md:text-[18px] text-gray-900 leading-tight mb-2">
                    {card.headline}
                  </h4>
                  {card.subheadline.includes('•') ? (
                    <div className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-medium">
                      {card.subheadline.split('•').map((part, i) =>
                        i === 0 ? (
                          <span key={i} className="block mb-2 font-bold text-gray-800">{part.trim()}</span>
                        ) : (
                          <span key={i} className="block mb-1 pl-4 relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#1877f2] before:rounded-full before:absolute before:left-0 before:top-2 text-gray-600">{part.trim()}</span>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-medium">{card.subheadline}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 3,
                headline: "Consulted and audited over 2000+ businesses",
                subheadline: "Helping countless brand owners identify critical bottlenecks and architect scalable growth systems tailored for their massive success.",
                src: "/3.png"
              },
              {
                id: 4,
                headline: "I spoke about our marketing success at an 8 figure business owners scaling event",
                subheadline: "Sharing battle-tested frameworks stage-side with elite founders, dissecting the exact strategies that scale from 6 to 8 figures in record time.",
                src: "/4.png"
              },
              {
                id: 5,
                headline: "We helped a Clothing Brand Owner Add $1.2M to His Brand in 13 Months",
                subheadline: "This success helped him: • Generate 50,000+ orders in 2 years • Build an in-house manufacturing team providing stable employment • Pay designers full-time income • Partner with long-term shipment companies & become Assassin’s Creed official merchandise partner",
                src: "/5.png"
              }
            ].map(card => (
              <div key={card.id} className="bg-white rounded-2xl shadow-xl p-5 flex flex-col border border-gray-100 transition-all hover:shadow-2xl">
                <div
                  className="rounded-xl overflow-hidden relative group cursor-pointer bg-gray-50 flex-1 flex items-center justify-center mb-5 border border-gray-100"
                  onClick={() => setPreviewImage(card.src)}
                >
                  <Image
                    src={card.src}
                    alt={`Proof ${card.id}`}
                    width={800}
                    height={800}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-[#1877f2]/10 transition-colors duration-300 rounded-xl" />
                </div>
                <div className="px-1 text-left">
                  <h4 className="font-extrabold text-[15px] md:text-[16px] text-gray-900 leading-tight mb-2">
                    {card.headline}
                  </h4>
                  {card.subheadline.includes('•') ? (
                    <div className="text-[12px] md:text-[13px] text-gray-600 leading-relaxed font-medium">
                      {card.subheadline.split('•').map((part, i) =>
                        i === 0 ? (
                          <span key={i} className="block mb-2 font-bold text-gray-800">{part.trim()}</span>
                        ) : (
                          <span key={i} className="block mb-1 pl-4 relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#1877f2] before:rounded-full before:absolute before:left-0 before:top-1.5 text-gray-600">{part.trim()}</span>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-[12px] md:text-[13px] text-gray-600 leading-relaxed font-medium">{card.subheadline}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Final CTA */}
        <Button
          onClick={scrollToForm}
          className="w-full md:w-[900px] bg-[#1877f2] hover:bg-[#1565c0] text-white font-extrabold text-[14px] sm:text-[17px] md:text-[22px] py-4 sm:py-6 md:py-8 rounded shadow-2xl mb-20 hover:scale-[1.02] transition-all uppercase tracking-wide h-auto whitespace-normal leading-tight px-4"
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
