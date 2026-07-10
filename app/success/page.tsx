"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function SuccessRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      router.replace(`/?session_id=${sessionId}`);
    } else {
      router.replace("/");
    }
  }, [sessionId, router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-[#F46F00] animate-spin" />
      <p className="text-gray-400 text-[14px] animate-pulse font-medium">Redirecting you to the order confirmation page...</p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessRedirect />
    </Suspense>
  );
}
