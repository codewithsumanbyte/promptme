"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bookmark, Menu, X, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (pathname.startsWith("/admin")) return null

  const links = [
    { name: "Home", href: "/" },
    { name: "Trending", href: "/trending" },
    { name: "Explore", href: "/explore" },
    { name: "Lab", href: "/lab" },
    { name: "Wallpapers", href: "/wallpapers" },
    { name: "Saved", href: "/saved" },
    { name: "About", href: "/about" },
  ]

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center p-4 pointer-events-none">
        <header className={cn(
          "w-full max-w-5xl pointer-events-auto backdrop-blur-xl border transition-all duration-500 ease-in-out rounded-full px-5 py-2.5 flex items-center justify-between",
          scrolled 
            ? "bg-zinc-900/80 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] translate-y-2" 
            : "bg-transparent border-transparent translate-y-0"
        )}>
          
          {/* Logo anchor restored for identity balance */}
          {/* Stylized Name branding instead of logo */}
          <Link href="/" className="flex items-center shrink-0 gap-1.5" onClick={() => setMobileOpen(false)}>
            <span className="text-xl font-extrabold tracking-tighter text-white">WTF<span className="text-zinc-400">prompt</span></span>
          </Link>

          {/* Desktop Nav Center */}
          <nav className="hidden md:flex items-center bg-white/[0.03] border border-white/[0.05] rounded-full px-1.5 py-1">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-5 py-2 text-[13px] font-semibold tracking-tight rounded-full transition-all duration-300",
                    isActive 
                      ? "bg-white text-black shadow-[0_2px_10px_rgba(255,255,255,0.2)]" 
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>

          {/* Actions Trailing */}
          <div className="flex items-center gap-3">
            <Link 
              href="/saved" 
              className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
            >
              <Bookmark className="w-[18px] h-[18px]" />
            </Link>
            
            <Link href="/explore" className="hidden md:flex">
               <button className="bg-white text-black text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-zinc-200 transition-all flex items-center gap-1.5">
                  Explore <ArrowUpRight className="w-3 h-3" />
               </button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-white bg-white/10 rounded-full border border-white/10"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </header>
      </div>

      {/* Mobile Fullscreen Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl md:hidden flex flex-col pt-24 px-8 animate-in fade-in zoom-in-95 duration-200">
           <div className="flex flex-col gap-6 mt-10">
             {links.map((link) => (
               <Link
                 key={link.href}
                 href={link.href}
                 onClick={() => setMobileOpen(false)}
                 className={cn(
                   "text-3xl font-extrabold tracking-tighter transition-all",
                   pathname === link.href ? "text-white translate-x-2" : "text-zinc-600 hover:text-white"
                 )}
               >
                 {link.name}
               </Link>
             ))}
             
             <div className="h-px w-full bg-white/10 my-6" />
             
             <Link href="/explore" onClick={() => setMobileOpen(false)}>
               <button className="w-full bg-white text-black text-lg font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_40px_-5px_rgba(255,255,255,0.3)]">
                  Explore All Prompts <ArrowUpRight className="w-6 h-6" />
               </button>
             </Link>
           </div>
        </div>
      )}
    </>
  )
}
