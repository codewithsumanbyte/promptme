import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptMe | Viral AI Prompts",
  description: "Discover Viral AI Prompts Before Everyone Else",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased pb-16 md:pb-0`}>
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <BottomNav />
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
