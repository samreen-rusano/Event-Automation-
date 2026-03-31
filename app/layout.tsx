import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FacebookPixel from "@/components/FacebookPixel";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Ultimate Sales Engine Framework | Zen Focus Media",
  description:
    "Transform your clothing brand into a predictable revenue machine in 90 days. Join the live workshop for just $97.",
};

const RAW_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "";
const FB_PIXEL_ID = /^\d{10,}$/.test(RAW_PIXEL_ID) ? RAW_PIXEL_ID : null;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Facebook Pixel noscript fallback — fires for users with JS disabled */}
        {FB_PIXEL_ID && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
      </head>
      <body className="min-h-full flex flex-col">
        {/* Facebook Pixel — initializes on mount, tracks PageView on every route change */}
        <FacebookPixel />
        {/* Microsoft Clarity — cursor tracking, heatmaps, session recordings */}
        <MicrosoftClarity />
        {/* Vercel Analytics — tracks visitors, page views, geography, devices */}
        <Analytics />
        {/* Vercel Speed Insights — tracks Core Web Vitals (LCP, FID, CLS) */}
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
