"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Flame, Search, Bookmark } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname()

  if (pathname.startsWith("/admin")) {
    return null
  }

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Trending", href: "/trending", icon: Flame },
    { name: "Explore", href: "/explore", icon: Search },
    { name: "Saved", href: "/saved", icon: Bookmark },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 pb-safe">
      <nav className="flex h-full items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 w-16 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`relative p-1 rounded-full ${isActive ? "bg-primary/10" : ""}`}>
                <Icon className={`h-6 w-6 ${isActive && item.name === 'Trending' ? 'text-orange-500' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
