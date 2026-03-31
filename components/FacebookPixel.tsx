"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const RAW_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "";

// Only activate if the ID looks like a real numeric FB Pixel ID (not a placeholder)
const FB_PIXEL_ID = /^\d{10,}$/.test(RAW_PIXEL_ID) ? RAW_PIXEL_ID : null;

// Declare fbq on the window object
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

/**
 * Initialize Facebook Pixel.
 * Should only be called once on app mount.
 */
function initPixel() {
  if (!FB_PIXEL_ID) return;
  if (typeof window === "undefined") return;
  if (window.fbq) return; // already initialized

  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  window.fbq("init", FB_PIXEL_ID);
  window.fbq("track", "PageView");
}

/**
 * Track a standard or custom Facebook Pixel event.
 *
 * Usage:
 *   fbEvent("Lead")
 *   fbEvent("InitiateCheckout", { value: 97, currency: "USD" })
 *   fbEvent("Purchase", { value: 97, currency: "USD" })
 */
export function fbEvent(name: string, params?: Record<string, any>) {
  if (!FB_PIXEL_ID) return;
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", name, params);
}

/**
 * React component that initializes Facebook Pixel on mount
 * and fires PageView on every client-side route change.
 *
 * Place once inside your root layout.
 */
export default function FacebookPixel() {
  const pathname = usePathname();

  // Initialize pixel on first mount
  useEffect(() => {
    initPixel();
  }, []);

  // Track PageView on route changes (SPA navigation)
  useEffect(() => {
    if (!FB_PIXEL_ID) return;
    if (typeof window === "undefined" || !window.fbq) return;
    window.fbq("track", "PageView");
  }, [pathname]);

  // No visible UI
  return null;
}
