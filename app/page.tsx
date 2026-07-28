"use client";

import React, { useState, useEffect, Suspense } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from "@/components/CheckoutForm";
import { RefreshCw } from "lucide-react";
import { fbEvent } from "@/components/FacebookPixel";
import { readSessionStorage, writeSessionStorage } from "@/lib/browser";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function LandingPageContent() {
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");

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

    const initStripe = async () => {
      try {
        const res = await fetch("/api/create-payment-intent", { method: "POST", body: "{}" });
        const data = await res.json();
        if (data.clientSecret && data.paymentIntentId) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
        }
      } catch (err) {
        console.error("Failed to preload payment intent:", err);
      }
    };
    initStripe();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* 
        Spacing rhythm:
        Large transitions deserve more whitespace (e.g. py-24, py-32)
        Connected ideas remain visually close (e.g. mb-6, mb-8)
        One idea per paragraph
      */}

      <main className="max-w-4xl mx-auto px-6 py-20">
        
        {/* HERO */}
        <section className="text-center mb-32 pt-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-8 max-w-3xl mx-auto">
            Discover How Streetwear Brand Owners Can Sell Out Their Next Drop In 30 Days…
          </h1>
          <div className="text-2xl md:text-3xl font-extrabold text-[#FF6B00] uppercase tracking-wider mb-10">
            With Just One Viral Ad.
          </div>
          <div className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto space-y-3 font-medium">
            <p>No marketing experience required.</p>
            <p>Just $30/day ad budget, around 30 minutes to setup.</p>
          </div>
        </section>

        <div className="w-16 h-px bg-[#FF6B00]/40 mx-auto mb-32" />

        {/* BIG NEWS */}
        <section className="text-center mb-32">
          <div className="inline-block px-4 py-1.5 border border-white/20 rounded-full text-xs font-bold tracking-widest uppercase mb-8">
            BIG NEWS
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8">For The First Time Ever…</h2>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            I’m releasing the proprietary One Viral Ad Framework I’ve developed after analyzing 5,000+ ads and studying the campaigns of hundreds of successful streetwear brands.
          </p>
        </section>

        <div className="w-16 h-px bg-white/20 mx-auto mb-32" />

        {/* FINALLY */}
        <section className="text-center mb-32">
          <h2 className="text-xl md:text-2xl font-bold text-gray-400 mb-8 uppercase tracking-widest">Finally…</h2>
          <p className="text-3xl md:text-4xl font-black leading-tight uppercase max-w-3xl mx-auto">
            A Simple Way For Streetwear Brand Owners To Sell Out Their Next Drop Without Becoming Full-Time Marketers.
          </p>
        </section>

        {/* REALITY CHECK */}
        <section className="max-w-2xl mx-auto mb-32 text-lg md:text-xl text-gray-300 space-y-8 leading-relaxed">
          <p className="font-bold text-white text-2xl">Let’s face it…</p>
          <p>Building a streetwear brand probably isn’t what you imagined.</p>
          <p className="text-[#FFB800] font-medium">
            [You started because you wanted to be creative. To build a brand people genuinely wanted to wear.]
          </p>
          <p className="font-bold text-white text-2xl pt-8">Instead…</p>
          <p>Most of your time is spent worrying about your next drop</p>
          <p>Worrying about cashflow</p>
          <p>Posting content.</p>
          <p>Trying new marketing tactics.</p>
          <p>Wondering when you can finally be creative with peace of mind.</p>
        </section>

        <div className="w-16 h-px bg-[#FF2E2E]/40 mx-auto mb-32" />

        {/* THE REALITY */}
        <section className="text-center mb-32 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-10">But Here’s The Reality…</h2>
          <div className="text-xl md:text-2xl text-gray-300 space-y-6">
            <p>Creativity needs cash flow.</p>
            <p>And cashflow needs marketing.</p>
            <p>Without cashflow,</p>
            <p>You spend more time stressing.</p>
            <p>You end up spend more time marketing than creating.</p>
            <p className="text-[#FF6B00] font-bold mt-10">The One Viral Ad Framework was built to change that.</p>
          </div>
        </section>

        {/* FORMULA (CIRCULAR PROCESS) */}
        <section className="mb-40">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-16">The Formula Is Surprisingly Simple</h2>
          
          <div className="relative max-w-lg mx-auto p-10 bg-[#0e0e0e] border border-white/10 rounded-full aspect-square flex flex-col items-center justify-center text-center">
            {/* Using a large icon and circular layout logic via CSS classes */}
            <RefreshCw className="absolute w-[120%] h-[120%] text-[#FFB800]/5 -z-10 animate-[spin_40s_linear_infinite]" />
            <div className="space-y-6 text-lg md:text-xl font-bold">
              <p className="text-white">Design your one viral Ad</p>
              <div className="w-px h-6 bg-[#FFB800] mx-auto"></div>
              <p className="text-white">launch</p>
              <div className="w-px h-6 bg-[#FFB800] mx-auto"></div>
              <p className="text-[#FFB800]">Sell out your drop</p>
              <div className="w-px h-6 bg-[#FFB800] mx-auto"></div>
              <p className="text-white">Reinvest part of the profits back into the Ad</p>
              <div className="w-px h-6 bg-[#FFB800] mx-auto"></div>
              <p className="text-white">Repeat the process.</p>
            </div>
          </div>
        </section>

        {/* WHO AM I */}
        <section className="max-w-2xl mx-auto mb-32 space-y-8 text-lg md:text-xl text-gray-300">
          <h2 className="text-2xl font-black text-[#FF6B00] mb-8">[WHO AM I and why should you listen?]</h2>
          <p>I’m Yasir Sultan.</p>
          <p>I’ve been running ads since 2017.</p>
          <p>Managed millions in ad spend.</p>
          <p>Generated tens of millions in revenue.</p>
          <p className="font-bold text-white pt-6">But more importantly…</p>
          <p className="text-[#FFB800] leading-relaxed">
            Over the past year I’ve analyzed more than [5,000 ads while studying what actually drives streetwear brand owners to build a brand in the first place ]
          </p>
        </section>

        <div className="w-16 h-px bg-white/20 mx-auto mb-32" />

        {/* THE PROBLEM */}
        <section className="max-w-3xl mx-auto mb-32 text-center">
          <h2 className="text-2xl md:text-4xl font-black mb-10 leading-tight">
            Here’s The Problem With Growing A Streetwear Brand Today…
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12">The old way of growing a streetwear brand no longer works.</p>
          
          <div className="text-left max-w-xl mx-auto space-y-6 text-lg md:text-xl text-gray-400">
            <p className="text-white font-medium mb-6">Remember when everyone told you to…</p>
            <ul className="space-y-4 list-none">
              <li>* Do live events.</li>
              <li>* Post content every day.</li>
              <li>* Spend months building your audience.</li>
              <li>* Launch countless drops hoping one finally takes off.</li>
              <li>* Test endless marketing ideas until something sticks.</li>
            </ul>
            <p className="text-[#FF2E2E] font-bold text-2xl pt-6">Those days are over.</p>
          </div>
        </section>

        {/* WHY IT DOESNT WORK & MINDSET SHIFT */}
        <section className="max-w-2xl mx-auto mb-32 space-y-8 text-lg md:text-xl text-gray-300">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-10">Why The Old Way Doesn’t Work Anymore</h2>
          <p>Here’s the truth most people won’t tell you.</p>
          <p>Success doesn’t come from working harder.</p>
          <p className="text-[#FF6B00] font-bold text-2xl">It comes from leverage.</p>
          <p>One Viral Ad can outperform months of daily content.</p>
          <p>One Viral Ad can outperform hundreds of pieces of &quot;ads&quot;</p>
          <p className="pt-6">The problem isn’t that you aren’t working hard enough.</p>
          <p>It’s that you’re spending your energy on low-leverage activities.</p>
          <p className="text-white font-medium">The goal isn’t to become a better content creator.</p>
          <p className="text-white font-bold">The goal is to build one marketing asset that continues bringing buyers to you.</p>
          <p>So that way you spend 99% of your time being creative.</p>
          <p className="text-[#FFB800] font-bold pt-4">You can achieve that dream in just 30 days.</p>
        </section>

        {/* MINDSET SHIFT */}
        <section className="max-w-2xl mx-auto mb-32 bg-[#111] p-10 md:p-16 rounded-3xl border border-white/5">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-10">The Mindset Shift That Changes Everything</h2>
          <div className="space-y-8 text-lg md:text-xl text-gray-300">
            <p className="text-[#FF2E2E] font-medium">Stop asking…</p>
            <p className="font-bold text-white text-2xl">“How can I work harder?”</p>
            <p className="text-[#00A36C] font-medium pt-4">Start asking…</p>
            <p className="font-bold text-white text-2xl leading-relaxed">“How can I create one marketing asset that keeps selling for me?”</p>
            
            <p className="pt-8 text-white">That’s the difference between…</p>
            <p className="text-gray-400">* Spending hours creating content that barely generates sales.</p>
            <p className="text-white">And…</p>
            <p className="text-[#FFB800] font-bold">* Creating One Viral Ad that consistently attracts buyers and sells out your drops.</p>
            <p className="pt-8">The second approach requires a completely different way of thinking.</p>
            <p className="text-white">And that’s exactly what you’ll learn inside The One Viral Ad Framework.</p>
          </div>
        </section>

        {/* INTRODUCING */}
        <section className="text-center mb-40">
          <p className="text-xl text-gray-400 font-medium tracking-widest uppercase mb-8">Introducing…</p>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-12">The One Viral Ad Framework</h2>
          
          <div className="max-w-2xl mx-auto space-y-6 text-xl md:text-2xl text-gray-300 font-medium mb-16">
            <p>Years of testing.</p>
            <p>Thousands of ads.</p>
            <p>Millions spent on advertising.</p>
          </div>

          <p className="text-2xl font-bold text-white mb-10">Compressed into one simple framework that:</p>
          <ul className="max-w-xl mx-auto text-left space-y-6 text-lg md:text-xl text-gray-300 mb-16">
            <li>* Takes less than 30 minutes to set up and launch</li>
            <li>* Requires 0 marketing experience or technical knowledge</li>
            <li>* Helps you achieve a profitable drop in just 30 days</li>
          </ul>

          <div className="max-w-2xl mx-auto space-y-6 text-lg md:text-xl text-gray-400">
            <p>This isn’t another collection of random marketing tactics.</p>
            <p>It’s a framework built from years of testing, thousands of ads, and real ads analysis of over 500 successful streetwear brands.</p>
          </div>
        </section>

        <div className="w-16 h-px bg-[#FF6B00]/40 mx-auto mb-32" />

        {/* PRICING & LOGIC */}
        <section className="max-w-3xl mx-auto mb-32 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-[#FF6B00] mb-16 leading-tight">
            GET INSTANT ACCESS TO THE ONE VIRAL AD FRAMEWORK FOR JUST $17
          </h2>
          
          <div className="text-left space-y-12 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            <p className="font-bold text-white text-2xl">Why Just $17?</p>
            <p>For 2 simple reasons.</p>
            
            <div className="space-y-4 pt-4">
              <p className="text-white font-bold text-xl">1. Because money talks.</p>
              <p>I’d rather you invest a small amount than give this framework away for free.</p>
              <p>People who invest—even a small amount—are far more likely to pay attention, implement what they learn, and actually use it for their next drop.</p>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-white font-bold text-xl">2. Because this is only the first step.</p>
              <p>I’m also launching a &quot;7 day build your viral Ad with us challenge&quot; where selected streetwear brand owners will build and launch their first Viral Ad with our guidance.</p>
              <p>I’d rather invite founders who have already demonstrated they’re serious by investing in this framework.</p>
              <p className="text-gray-400 italic">Yes, that’s the upsell. And you’ll see it on the next page.</p>
            </div>

            <p className="text-[#FFB800] font-bold text-2xl pt-8 text-center">
              But whether you join the challenge or not…<br/>
              The One Viral Ad Framework is yours to keep for just $17.
            </p>
          </div>
        </section>

        {/* GUARANTEE */}
        <section className="max-w-2xl mx-auto mb-32 bg-[#0e0e0e] border border-white/10 rounded-3xl p-10 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent"></div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">YES, OF COURSE THERE’S A GUARANTEE</h2>
          <p className="text-[#FFB800] font-bold text-xl mb-10">My 30-Day Money-Back Guarantee</p>
          
          <div className="text-left space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>While I can’t guarantee you’ll sell out your next drop within 30 days…</p>
            <p>Your results will depend on your work ethic, and how well you implement the framework.</p>
            <p className="text-white font-bold">What I can guarantee is that the value you’ll receive will be worth 50x more than the $17 you paid.</p>
            <p>Go through the framework. Study it. Use it to build your Viral Ad.</p>
            <p>If it doesn’t completely blow your mind with value, simply contact me at any point within the next 30 days.</p>
            <p className="text-white font-black text-xl pt-4">I’ll refund your entire $17.<br/>No questions asked.</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mb-32">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-16 uppercase">FREQUENTLY ASKED QUESTIONS</h2>
          
          <div className="space-y-12 text-lg md:text-xl">
            <div>
              <p className="font-bold text-white mb-3">What advertising platform does The One Viral Ad Framework work on?</p>
              <p className="text-gray-400">The framework is designed primarily for Meta advertising, including Facebook and Instagram.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-3">Do I need to be technically advanced to use this framework?</p>
              <p className="text-gray-400">No. Even if you’ve never opened Ads Manager before, you’ll be able to follow along.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-3">What if I don’t want to set up the campaign myself?</p>
              <p className="text-gray-400">You don’t have to. You can hire a freelancer to handle the technical campaign setup for less than 60 USD.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-3">Do I need any graphic design or video editing experience to create my Viral Ad?</p>
              <p className="text-gray-400">No. Zero experience required.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-3">How soon can I expect results?</p>
              <p className="text-gray-400 space-y-4">
                <span className="block">The honest answer is… I don’t know. I don’t know your product. I don’t know your work ethic. No one can honestly guarantee results.</span>
                <span className="block">What I can tell you is that some direct-to-consumer brands have generated meaningful sales within 7 days because they found the right angle and launched an ad that genuinely connected with their audience.</span>
                <span className="block">Your results may happen quickly. They may take longer.</span>
                <span className="block text-white font-medium">But once you create a Viral Ad that works… You now own a marketing asset you can use over and over again for future drops.</span>
              </p>
            </div>
            <div>
              <p className="font-bold text-white mb-3">Will this work for my specific brand?</p>
              <p className="text-gray-400 space-y-4">
                <span className="block">This framework was built specifically for streetwear and identity-driven clothing brands.</span>
                <span className="block">It is ideal if you sell: * T-shirts * Hoodies * Sweatshirts * Jackets * Or any other type of clothing people wear on their body.</span>
                <span className="block">If your business falls outside that category, this offer is not applicable to you.</span>
              </p>
            </div>
            <div>
              <p className="font-bold text-white mb-3">Do I need a large advertising budget?</p>
              <p className="text-gray-400">No. I recommend starting with around $30 per day.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-3">Do I need an audience to make this work?</p>
              <p className="text-gray-400">No. Even if you have zero audience, that’s completely fine.</p>
            </div>
          </div>
        </section>

        {/* FINAL CTA & CHECKOUT */}
        <section className="text-center mb-20" id="checkout">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-16 leading-tight max-w-4xl mx-auto">
            READY TO SELL OUT YOUR NEXT DROP IN 30 DAYS?
          </h2>

          <div className="mb-10 text-xl font-bold text-gray-300">
            Complete the form below to Get Instant Access To The One Viral Ad Framework Now
          </div>

          {clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#FF6B00',
                    colorBackground: '#000000',
                    colorText: '#ffffff',
                    colorDanger: '#df1b41',
                    fontFamily: 'system-ui, sans-serif',
                    borderRadius: '12px',
                    spacingUnit: '5px',
                  },
                  rules: {
                    '.Input': {
                      border: '1px solid #374151',
                      boxShadow: 'none',
                      backgroundColor: '#000000'
                    },
                    '.Input:focus': {
                      border: '1px solid #FF6B00',
                      boxShadow: 'none',
                    }
                  }
                }
              }}
            >
              <CheckoutForm paymentIntentId={paymentIntentId} clientSecret={clientSecret} />
            </Elements>
          ) : (
            <div className="py-20 flex justify-center">
              <div className="w-10 h-10 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LandingPageContent />
    </Suspense>
  );
}
