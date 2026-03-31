"use client";

import { useEffect } from "react";

const RAW_CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "";

// Only activate with a real Clarity project ID (alphanumeric, 7+ chars)
const CLARITY_ID = /^[a-z0-9]{7,}$/i.test(RAW_CLARITY_ID) ? RAW_CLARITY_ID : null;

declare global {
    interface Window {
        clarity: any;
    }
}

/**
 * Microsoft Clarity — Free cursor tracking, heatmaps & session recordings.
 * 
 * Features (all free, unlimited):
 *  - Session replay: watch exactly what every visitor does
 *  - Heatmaps: see where users click, scroll, and move their cursor
 *  - Rage clicks: detect frustrated users
 *  - Dead clicks: find broken UI elements
 *  - Scroll depth: see how far users read your page
 * 
 * Get your project ID at https://clarity.microsoft.com
 * Set NEXT_PUBLIC_CLARITY_ID in your .env
 */
export default function MicrosoftClarity() {
    useEffect(() => {
        if (!CLARITY_ID) return;
        if (typeof window === "undefined") return;
        if (window.clarity) return; // already loaded

        // Official Clarity tracking script
        (function (c: any, l: any, a: any, r: any, i: any, t?: any, y?: any) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
            t = l.createElement(r);
            t.async = 1;
            t.src = "https://www.clarity.ms/tag/" + i;
            y = l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t, y);
        })(window, document, "clarity", "script", CLARITY_ID);
    }, []);

    return null;
}
