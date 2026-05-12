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

export const metadata: Metadata = {
  title: "WTFprompt | Viral AI Prompts",
  description: "Discover Viral AI Prompts Before Everyone Else",
  applicationName: "WTFprompt",
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
