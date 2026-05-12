"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"

export function InstallPwaButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsVisible(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsVisible(false)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === "accepted") {
      setIsVisible(false)
      setDeferredPrompt(null)
    }
  }

  if (!isVisible) return null

  return (
    <button 
      onClick={handleInstall}
      className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(99,102,241,0.2)] animate-bounce-slow"
    >
      Install App <Download className="w-5 h-5" />
    </button>
  )
}
