"use client"

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { toast } from 'sonner'

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // 1. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // 2. Check if already running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsVisible(false);
      return;
    }

    // 3. If iOS and not standalone, we show it (with custom alert logic)
    if (isIOSDevice) {
      setIsVisible(true);
    }

    // 4. Listen for standard Chrome/Android Install Prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      toast("Install App Instructions", {
        description: "Tap the Share button and select 'Add to Home Screen' to install the Admin App.",
        duration: 6000,
      });
      return;
    }

    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success("App installed successfully!");
      setIsVisible(false); // Instantly hide button
    }
    
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleInstallClick}
      title="Download Admin App"
      className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-950/50 cursor-pointer group active:scale-95"
    >
      <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
}
