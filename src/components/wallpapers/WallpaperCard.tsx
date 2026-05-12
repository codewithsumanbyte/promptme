"use client"

import { motion } from "framer-motion"
import { Download, Monitor, Smartphone, Tablet, Eye } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface WallpaperCardProps {
  wallpaper: {
    id: string
    title: string
    imageUrl: string
    deviceType: string
    category: string
  }
  onOpen: () => void
}

export function WallpaperCard({ wallpaper, onOpen }: WallpaperCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getDeviceIcon = () => {
    switch (wallpaper.deviceType) {
      case "mobile": return <Smartphone className="w-3.5 h-3.5" />
      case "tablet": return <Tablet className="w-3.5 h-3.5" />
      default: return <Monitor className="w-3.5 h-3.5" />
    }
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening lightbox when downloading
    try {
      const response = await fetch(wallpaper.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${wallpaper.title.replace(/\s+/g, "_")}_WTFprompt.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (e) {
      window.open(wallpaper.imageUrl, '_blank')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onOpen}
      className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* High Fidelity Visual Canvas */}
      <img
        src={wallpaper.imageUrl}
        alt={wallpaper.title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Heavy atmospheric gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 md:opacity-60 md:group-hover:opacity-90 transition-opacity duration-500" />

      {/* Top Hardware Label */}
      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 flex items-center gap-1.5 z-10">
        <div className="text-zinc-300">{getDeviceIcon()}</div>
        <span className="text-[10px] font-black uppercase tracking-wider text-white">{wallpaper.deviceType}</span>
      </div>

      {/* Category Tag right alignment */}
      <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md border border-white/5 rounded-full px-2.5 py-1 z-10">
         <span className="text-[9px] font-bold uppercase text-zinc-300 tracking-widest">{wallpaper.category}</span>
      </div>

      {/* Lower Data Bar */}
      <div className="absolute bottom-0 inset-x-0 p-4 z-10 flex flex-col justify-end transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-300">
         <h3 className="text-white font-bold text-lg tracking-tight leading-tight group-hover:text-indigo-300 transition-colors truncate pr-4">
           {wallpaper.title}
         </h3>
         
         <div className="flex items-center justify-between mt-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-75">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-white text-black font-black text-xs uppercase py-2.5 px-4 rounded-full hover:bg-indigo-100 hover:scale-105 transition-all shadow-xl active:scale-95"
            >
               <Download className="w-3.5 h-3.5" /> Download
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); window.open(wallpaper.imageUrl, '_blank'); }}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-90"
            >
              <Eye className="w-4 h-4" />
            </button>
         </div>
      </div>
    </motion.div>
  )
}
