"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { WallpaperCard } from "@/components/wallpapers/WallpaperCard"
import { ParticleBackground } from "@/components/3d/particle-background"
import { ImageIcon, Monitor, Smartphone, Tablet, Layers, Loader2, X, ChevronLeft, ChevronRight, Download } from "lucide-react"

type DeviceFilter = "all" | "desktop" | "mobile" | "tablet"

export default function WallpapersPage() {
  const [wallpapers, setWallpapers] = useState<any[]>([])
  const [filter, setFilter] = useState<DeviceFilter>("all")
  const [loading, setLoading] = useState(true)
  
  // Swiper State
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [[page, direction], setPage] = useState([0, 0]) // Tracking directional sliding motion

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/wallpapers?device=${filter}`)
        const data = await res.json()
        setWallpapers(data)
      } catch (error) {
        console.error("Failed to acquire assets")
      } finally {
        setLoading(false)
      }
    }
    fetchAssets()
  }, [filter])

  const tabs = [
    { id: "all", label: "All Matrices", icon: Layers },
    { id: "desktop", label: "Desktop", icon: Monitor },
    { id: "mobile", label: "Handset", icon: Smartphone },
    { id: "tablet", label: "Tablet", icon: Tablet },
  ]

  const handleOpen = (index: number) => {
    setSelectedIndex(index)
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
  }

  const handleClose = () => {
    setSelectedIndex(null)
    document.body.style.overflow = 'unset'
  }

  const paginate = (newDirection: number) => {
    if (selectedIndex === null) return
    let newIndex = selectedIndex + newDirection
    if (newIndex < 0) newIndex = wallpapers.length - 1
    if (newIndex >= wallpapers.length) newIndex = 0
    setSelectedIndex(newIndex)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  // Tinder Motion Controllers
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 300], [-20, 20])
  const opacityOverlay = useTransform(x, [-200, 0, 200], [0.4, 1, 0.4]) // Slight fade during rotation
  
  // Reset physics vectors when the viewport key rotates
  useEffect(() => {
    x.set(0)
  }, [selectedIndex, x])

  return (
    <main className="min-h-screen bg-black pt-28 pb-24 relative overflow-hidden">
      <ParticleBackground />

      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
         <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] bg-violet-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        
        <header className="text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/10 px-3 py-1 rounded-full mb-4 animate-in fade-in duration-700">
            <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-400">Premium Visual Library</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-4">
            WTF<span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-violet-700">wallpaper</span>
          </h1>
          
          <p className="text-zinc-500 text-sm md:text-lg font-medium max-w-xl mx-auto">
            Synchronize your screens with high-conversion aesthetics engineered for distinct hardware matrices.
          </p>

          <div className="mt-10 flex bg-zinc-950 border border-white/5 p-1.5 rounded-2xl backdrop-blur-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = filter === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as DeviceFilter)}
                  className={`relative flex items-center gap-2 px-4 md:px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all rounded-xl ${
                    isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab-bg"
                      className="absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </header>

        {loading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-zinc-600">
             <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
             <p className="text-xs uppercase font-black tracking-widest animate-pulse">Calibrating Visual Matrix...</p>
          </div>
        ) : wallpapers.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {wallpapers.map((wallpaper, idx) => (
                <WallpaperCard 
                  key={wallpaper.id} 
                  wallpaper={wallpaper} 
                  onOpen={() => handleOpen(idx)} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="min-h-[300px] bg-zinc-950/50 border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center px-6">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <ImageIcon className="w-6 h-6 text-zinc-700" />
             </div>
             <h3 className="text-xl font-bold text-white mb-1">No Nodes Detected</h3>
             <p className="text-sm text-zinc-500 max-w-sm">The current spatial coordinate holds no visually deployed assets for this vector. Check back shortly.</p>
          </div>
        )}
      </div>

      {/* FULLSCREEN INSTAGRAM-STYLE SWIPE LIGHTBOX */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center overflow-hidden"
          >
            {/* Master Exit Button */}
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 md:top-10 md:right-10 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-md text-white transition-all active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Desktop Control Keys */}
            <button 
              onClick={() => paginate(-1)}
              className="hidden md:flex absolute left-8 z-40 w-14 h-14 bg-white/5 border border-white/5 rounded-full items-center justify-center text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button 
              onClick={() => paginate(1)}
              className="hidden md:flex absolute right-8 z-40 w-14 h-14 bg-white/5 border border-white/5 rounded-full items-center justify-center text-white hover:bg-white/10 transition-all"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Swipe Engine Center */}
            <div className="relative w-full h-full max-w-5xl mx-auto flex flex-col items-center justify-center p-4 md:p-12 cursor-grab active:cursor-grabbing">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={selectedIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-center px-4"
                >
                  {/* TINDER ROTATION WRAPPER */}
                  <motion.div
                     drag="x"
                     style={{ x, rotate, opacity: opacityOverlay }}
                     dragConstraints={{ left: 0, right: 0 }}
                     dragElastic={1}
                     onDragEnd={(e, { offset, velocity }) => {
                       const swipe = swipePower(offset.x, velocity.x)
                       if (swipe < -swipeConfidenceThreshold) {
                         paginate(1)
                       } else if (swipe > swipeConfidenceThreshold) {
                         paginate(-1)
                       }
                     }}
                     className="flex flex-col items-center justify-center w-full h-full will-change-transform"
                  >
                     <div className="relative w-full max-h-[70vh] md:max-h-[80vh] aspect-[4/5] md:aspect-video flex items-center justify-center">
                       <img 
                         src={wallpapers[selectedIndex]?.imageUrl} 
                         alt={wallpapers[selectedIndex]?.title}
                         className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10 pointer-events-none select-none"
                       />
                     </div>
                     
                     <div className="mt-8 text-center max-w-md">
                        <div className="flex items-center justify-center gap-2 mb-2">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-3 py-0.5 rounded-full border border-violet-500/20">
                             {wallpapers[selectedIndex]?.deviceType}
                           </span>
                           <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-white/5 px-3 py-0.5 rounded-full">
                             {wallpapers[selectedIndex]?.category}
                           </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                          {wallpapers[selectedIndex]?.title}
                        </h2>
                        
                        <a 
                          href={wallpapers[selectedIndex]?.imageUrl} 
                          target="_blank"
                          download
                          className="mt-6 inline-flex items-center gap-3 bg-white text-black font-black px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-xl active:scale-95"
                        >
                           <Download className="w-5 h-5" /> DOWNLOAD IN 4K
                        </a>
                        <p className="mt-4 text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
                          Swipe Left/Right to Browse
                        </p>
                     </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
