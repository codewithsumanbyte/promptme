import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";

const inter = Inter({
  subsets: ["latin"],
});

import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const baseUrl = "https://wtfprompt.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "WTFprompt | Premium AI Prompts & Dynamic 4K Wallpapers",
    template: "%s | WTFprompt"
  },
  description: "Unlock the future of digital art. Discover viral AI prompts, high-performance prompt engineering guides, and ultra-high definition 4K AI-generated wallpapers for desktop & mobile.",
  applicationName: "WTFprompt",
  keywords: [
    "AI Prompts", "Midjourney Prompts", "Stable Diffusion", "Prompt Engineering", 
    "4K Wallpapers", "AI Generated Art", "ChatGPT Prompts", "Premium Prompts", 
    "Digital Art Marketplace", "Cyberpunk Wallpaper", "Anime Art AI"
  ],
  authors: [{ name: "WTFprompt Labs" }],
  creator: "WTFprompt Team",
  publisher: "WTFprompt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "WTFprompt | Discover Premium AI Prompts & High-End Visuals",
    description: "Access top-tier prompt frameworks and stunning 4K AI art. Elevate your digital workspace now.",
    url: baseUrl,
    siteName: "WTFprompt",
    images: [
      {
        url: "/hero-card-bg.png",
        width: 1200,
        height: 630,
        alt: "WTFprompt Digital Landscape",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WTFprompt | Viral AI Prompts & 4K Art",
    description: "Level up your AI generation workflow with premium curated prompts and free ultra-HD wallpapers.",
    images: ["/hero-card-bg.png"],
    creator: "@wtfprompt",
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "BGlI8JciGBjL2la2HyWC_yTDnkkqIyss5lJQbv3EHUM",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WTFprompt",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body 
        className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased pb-16 md:pb-0 overflow-x-hidden`}
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <BottomNav />
        <Toaster theme="dark" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
