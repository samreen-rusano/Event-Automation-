"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Mail,
  Video,
  CalendarCheck,
  AlertCircle,
  LifeBuoy,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Clock,
  VideoOff
} from "lucide-react";
import { fbEvent } from "@/components/FacebookPixel";
import { MEET_DETAILS } from "@/lib/config";
import { copyTextToClipboard } from "@/lib/browser";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type SessionData = {
  name: string;
  email: string;
  phone?: string;
  amount: string;
  transactionId: string;
  paymentStatus: string;
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    const copied = await copyTextToClipboard(text);

    if (!copied) return;

    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const date = "April 13, 2026";
  const time = "8pm New York time (EST)";

  useEffect(() => {
    if (!sessionId) {
      // Direct access attempt - redirect to home
      router.replace("/");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/verify-session?session_id=${sessionId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Verification failed.");
        setSessionData(data);

        // Fire Purchase once per Stripe session id to avoid duplicates in strict/dev remounts.
        if (typeof window !== "undefined") {
          const purchaseKey = `fb_purchase_${sessionId}`;
          if (!window.sessionStorage.getItem(purchaseKey)) {
            fbEvent("Purchase", {
              value: 97,
              currency: "USD",
              content_name: "Sales Engine Workshop",
              transaction_id: data.transactionId,
            });
            window.sessionStorage.setItem(purchaseKey, "1");
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (!sessionData && !loading && !error) return null;
  const d = sessionData!;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040B1A] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#1877f2] animate-spin" />
        <p className="text-gray-400 text-[14px] animate-pulse font-medium">Confirming your payment…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#040B1A] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
        <p className="text-gray-400 text-[14px] max-w-sm">{error}</p>
        <Button onClick={() => window.location.href = "/"} className="bg-[#1877f2] hover:bg-[#1565c0] text-white px-8 py-4 rounded font-bold mt-2 transition-all hover:scale-[1.02] cursor-pointer">
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040B1A] text-white font-sans selection:bg-[#1877f2] selection:text-white pb-16">

      {/* HEADER */}
      <div className="w-full flex justify-center pt-8 pb-4 border-b border-gray-800">
        <Image
          src="/logoMain.png"
          alt="Brand Logo"
          width={160}
          height={50}
          className="w-auto h-auto object-contain"
          priority
        />
      </div>

      <div className="max-w-[750px] mx-auto px-4 flex flex-col items-center pt-10">

        {/* 1. HERO */}
        <div className="w-full flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>

          <div className="w-full max-w-[500px] bg-[#1877f2] text-white font-bold text-[13px] md:text-[15px] py-2 rounded mb-6 text-center uppercase tracking-wide">
            PAYMENT SUCCESSFUL ✓
          </div>

          <h1 className="text-3xl md:text-[42px] font-bold text-center leading-[1.1] mb-4 text-[#f8fafc]">
            SUCCESS – YOU'RE IN!
          </h1>
          <h2 className="text-[17px] md:text-[20px] font-semibold text-gray-300 mb-4">
            Congratulations on registering, {d.name}!
          </h2>
          <p className="text-[14px] md:text-[15px] text-gray-400 leading-relaxed max-w-[520px]">
            You've successfully unlocked the exact strategies to build a predictable revenue machine. But you're <strong>not done yet</strong> — complete the steps below.
          </p>
        </div>

        {/* 2. NEXT STEPS */}
        <div className="w-full mb-10">
          <div className="w-full bg-[#1877f2] text-white font-bold text-[13px] md:text-[15px] py-2 rounded-t text-center uppercase tracking-wide">
            IMPORTANT NEXT STEPS
          </div>

          <div className="w-full bg-white text-black rounded-b-md shadow-2xl overflow-hidden">

            {/* Card 1 */}
            <div className="flex items-start gap-4 p-5 border-b border-gray-100">
              <div className="shrink-0 w-10 h-10 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#1877f2]" />
              </div>
              <div>
                <p className="font-bold text-[15px] text-gray-900 mb-1">1. Check Your Email</p>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  Your receipt and access details were sent to <strong>{d.email}</strong>.
                </p>
                <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded mt-2 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> Check promotions/spam folder.
                </div>
              </div>
            </div>

            {/* Card 2: Primary Meet CTA */}
            <div className="relative flex items-start gap-4 p-5 border-b border-gray-100 bg-blue-50">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#1877f2] rounded-l" />
              <div className="shrink-0 w-10 h-10 bg-[#1877f2] rounded-full flex items-center justify-center shadow-md">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-[15px] text-gray-900 mb-1">2. Save Google Meet Details</p>
                <p className="text-[13px] text-gray-600 leading-relaxed mb-3">
                  <strong>This step is required to attend.</strong> Click below to secure your unique live session access link.
                </p>
                <Button
                  onClick={() => setIsZoomModalOpen(true)}
                  className="bg-[#1877f2] hover:bg-[#1565c0] text-white font-bold text-[13px] sm:text-[14px] px-4 sm:px-6 py-4 sm:py-5 rounded shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] w-full sm:w-auto h-auto whitespace-normal leading-tight cursor-pointer"
                >
                  View Google Meet Details <ArrowRight className="w-4 h-4 shrink-0" />
                </Button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex items-start gap-4 p-5">
              <div className="shrink-0 w-10 h-10 bg-purple-50 border border-purple-100 rounded-full flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="font-bold text-[15px] text-gray-900 mb-1">3. Add to Calendar</p>
                <p className="text-[13px] text-gray-500 mb-3">Block your time so you don't miss any live strategies.</p>
                <div className="flex gap-6 text-[13px]">
                  <div><span className="font-bold text-gray-400 uppercase text-[10px] tracking-wide block">Date</span><span className="text-gray-800 font-semibold">{date}</span></div>
                  <div><span className="font-bold text-gray-400 uppercase text-[10px] tracking-wide block">Time</span><span className="text-gray-800 font-semibold">{time}</span></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. What Happens Next */}
        <div className="w-full bg-white text-black rounded-md shadow-2xl mb-8 p-6 md:p-8">
          <h3 className="text-[18px] md:text-[22px] font-extrabold mb-5 text-gray-900">WHAT HAPPENS NEXT</h3>
          <ul className="space-y-3 mb-6">
            {[
              "You will receive your unique Google Meet link securely.",
              "A reminder email will be sent 24 hours before we begin.",
              "Be ready for a value-packed live workshop with a dedicated Q&A.",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-[13px] md:text-[14px] text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
          <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r px-4 py-3">
            <p className="font-bold text-gray-800 text-[13px] mb-1">Can't make it on time?</p>
            <p className="text-[12px] text-gray-600 leading-relaxed">
              A limited-time replay will be sent directly to your inbox after the live event. Still save your Google Meet link to stay notified.
            </p>
          </div>
        </div>

        {/* 4. Order Summary (Receipt) */}
        <div className="w-full bg-white text-black rounded-md shadow-2xl mb-8 overflow-hidden">
          <div className="bg-[#1877f2] text-white font-bold text-[13px] md:text-[15px] py-2 text-center uppercase tracking-wide">
            ORDER SUMMARY
          </div>
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
              <div>
                <p className="font-bold text-gray-900 text-[14px]">Workshop Ticket</p>
                <p className="text-[12px] text-gray-400">The Ultimate Sales Engine Framework</p>
              </div>
              <span className="text-xl font-extrabold text-[#1877f2]">{d.amount}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[13px] text-gray-600 mb-4">
              <div><span className="font-bold text-gray-400 text-[10px] uppercase tracking-wide block">Date</span>{date}</div>
              <div><span className="font-bold text-gray-400 text-[10px] uppercase tracking-wide block">Time</span>{time}</div>
              <div><span className="font-bold text-gray-400 text-[10px] uppercase tracking-wide block">Name</span>{d.name}</div>
              <div><span className="font-bold text-gray-400 text-[10px] uppercase tracking-wide block">Email</span><span className="break-all">{d.email}</span></div>
            </div>
            <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
              <div>
                <span className="font-bold text-gray-400 text-[10px] uppercase tracking-wide block">Transaction ID</span>
                <span className="font-mono text-[11px] text-gray-500">{d.transactionId}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-400 text-[10px] uppercase tracking-wide block">Status</span>
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[11px] font-bold px-2 py-0.5 rounded-full">✓ PAID</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Support */}
        <div className="w-full bg-white text-black rounded-md shadow-md mb-8 p-5 flex items-center justify-between gap-4 flex-col sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center">
              <LifeBuoy className="w-4 h-4 text-[#1877f2]" />
            </div>
            <div>
              <p className="font-bold text-[14px] text-gray-900">Need Help?</p>
              <p className="text-[12px] text-gray-500">Our team is happy to help with any questions. Email us at yasirsultan1992@gmail.com</p>
            </div>
          </div>
          <Button onClick={() => window.location.href = "mailto:yasirsultan1992@gmail.com"} variant="outline" className="border-[#1877f2] text-[#1877f2] hover:bg-[#1877f2] hover:text-white text-[13px] font-bold transition-all w-full sm:w-auto h-auto whitespace-normal leading-tight py-3 cursor-pointer">
            Contact Support
          </Button>
        </div>

        {/* 6. Final CTA */}
        <div className="w-full text-center mb-10">
          <h2 className="text-[22px] md:text-[28px] font-extrabold text-white mb-2">
            We're excited to see you inside.
          </h2>
          <p className="text-[13px] text-gray-500 mb-6">
            Lock in your focus. Block out distractions. Get ready to transform your brand.
          </p>
          <Button
            onClick={() => setIsZoomModalOpen(true)}
            className="w-full md:w-auto bg-[#1877f2] hover:bg-[#1565c0] text-white font-bold text-[16px] md:text-[18px] px-10 py-6 rounded shadow-lg transition-all hover:scale-[1.02] flex items-center gap-2 mx-auto cursor-pointer h-auto whitespace-normal leading-tight"
          >
            Join Google Meet Now <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* FOOTER */}
        <div className="w-full flex flex-col items-center text-center pb-8 border-t border-gray-800 pt-8">
          <Image
            src="/logoMain.png"
            alt="Brand Logo"
            width={140}
            height={45}
            className="w-auto h-auto object-contain mb-4 opacity-70"
          />
          <p className="text-[10px] text-gray-600 max-w-[500px] leading-relaxed">
            Disclaimer: The results expressed in this training are illustrative and not guaranteed. Your success is entirely up to you and the work you put in.
          </p>
        </div>

      </div>

      {/* ZOOM DETAILS MODAL */}
      <Dialog open={isZoomModalOpen} onOpenChange={setIsZoomModalOpen}>
        <DialogContent className="bg-[#040B1A] border-gray-800 text-white max-w-[500px] p-0 overflow-hidden rounded-2xl shadow-2xl">
          <div className="bg-[#1877f2] p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <Video className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-xl md:text-2xl font-bold mb-2">Google Meeting Details</DialogTitle>
            <DialogDescription className="text-blue-100/80 text-[14px]">
              Copy your access details below or join the live session directly.
            </DialogDescription>
          </div>

          <div className="p-6 space-y-5">
            {/* Topic & Time */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 shrink-0"><Video className="w-4 h-4 text-gray-400" /></div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Topic</p>
                  <p className="text-[14px] text-gray-200 font-medium">{MEET_DETAILS.topic}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 shrink-0"><Clock className="w-4 h-4 text-gray-400" /></div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Time</p>
                  <p className="text-[14px] text-gray-200 font-medium">{MEET_DETAILS.time}</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-800 w-full" />

            {/* Dial In Grid */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Phone Dial In</p>
                  <button
                    onClick={() => copyToClipboard(MEET_DETAILS.dialIn || '', 'dial')}
                    className="p-1.5 hover:bg-white/5 rounded transition-colors cursor-pointer"
                  >
                    {copiedField === 'dial' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                  </button>
                </div>
                <p className="text-[15px] font-mono font-bold text-white leading-none">{MEET_DETAILS.dialIn}</p>
              </div>
            </div>

            {/* Link Box */}
            <div className="bg-blue-500/5 p-4 rounded-lg border border-blue-500/10 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-wider text-[#1877f2] font-bold">Meeting Link</p>
                <button
                  onClick={() => copyToClipboard(MEET_DETAILS.link, 'link')}
                  className="p-1.5 hover:bg-blue-500/10 rounded transition-colors cursor-pointer"
                >
                  {copiedField === 'link' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#1877f2]" />}
                </button>
              </div>
              <p className="text-[12px] font-mono text-gray-400 break-all leading-tight mb-2">
                {MEET_DETAILS.link}
              </p>
              <a
                href={MEET_DETAILS.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#1877f2] hover:bg-[#1565c0] text-white py-3 rounded-lg font-bold text-[14px] transition-all cursor-pointer"
              >
                Launch Google Meet <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#040B1A] flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-10 h-10 text-[#1877f2] animate-spin" />
        <p className="text-gray-500 font-medium text-[13px]">Loading your confirmation…</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
