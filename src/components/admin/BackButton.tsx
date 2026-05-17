"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export function BackButton() {
  const router = useRouter()
  const pathname = usePathname()

  // Don't show the back button if we are already on the main landing of admin, 
  // or we can make it go back to the main site '/'!
  const isMainAdmin = pathname === "/admin"

  const handleBack = () => {
    if (isMainAdmin) {
      router.push("/")
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleBack}
      className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-zinc-400 active:bg-white/10 active:text-white transition-all cursor-pointer mr-1"
      title="Go Back"
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
  )
}
