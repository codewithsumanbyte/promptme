"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Copy, Eye, Bookmark } from "lucide-react"

export function HeroCard3D() {
  return (
    <div className="relative w-full max-w-md h-full flex items-center justify-center lg:mt-0 mt-12 min-h-[450px]">
      
      {/* The Glowing Base Pedestal */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-64 h-8 bg-white/20 rounded-[50%] blur-xl pointer-events-none" />
      <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[200px] h-3 bg-black border border-white/50 rounded-[50%] shadow-[0_0_25px_rgba(255,255,255,0.3)] pointer-events-none flex items-center justify-center">
         <div className="w-[180px] h-2 bg-zinc-900 rounded-[50%] border border-white/20" />
      </div>
      
      {/* Floating Orbital Ring */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute w-[400px] h-[400px] border border-white/10 rounded-full pointer-events-none"
        style={{ 
           transform: "rotateX(70deg) rotateY(-10deg)",
           boxShadow: "0 0 50px rgba(255,255,255,0.03)" 
        }}
      />

      {/* Floating Spheres & Polyhedrons */}
      <motion.img 
        src="/black-sphere.png" 
        alt="Floating Sphere"
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute -bottom-5 -right-5 w-32 h-32 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] pointer-events-none z-30"
      />

      <motion.img 
        src="/polyhedron.png" 
        alt="Floating Gem"
        animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute top-0 -right-12 w-36 h-36 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] pointer-events-none z-10"
      />

      {/* The Tilted Feature Card */}
      <motion.div
        initial={{ y: 20, opacity: 0, rotateY: -25, rotateX: 15 }}
        animate={{ y: 0, opacity: 1, rotateY: -20, rotateX: 12 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative z-20 w-[320px] glass-card rounded-3xl overflow-hidden p-1.5"
      >
        <div className="relative rounded-[20px] overflow-hidden h-[280px]">
          <img src="/hero-card-bg.png" alt="Cyberpunk City" className="w-full h-full object-cover opacity-90" />
          
          {/* Badge inside card */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-medium text-white">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-amber-300"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Featured Prompt
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-white leading-tight mb-2">Cinematic Cyberpunk City</h3>
          <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
            Ultra realistic futuristic city at night with neon lights, rain, reflections, and atmospheric mood.
          </p>

          <div className="inline-flex bg-white/10 px-2 py-1 rounded-md border border-white/10 items-center gap-1.5 text-[10px] text-white font-medium mb-5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            Image Prompt
          </div>

          <div className="border-t border-white/5 pt-4 mb-4 flex items-center justify-between px-1">
            <div className="text-center flex flex-col items-center gap-0.5">
              <span className="text-[10px] font-semibold text-white flex items-center gap-1"><Eye className="w-3 h-3 text-zinc-400"/> 12.5K</span>
              <span className="text-[9px] text-zinc-500">Views</span>
            </div>
            <div className="text-center flex flex-col items-center gap-0.5">
              <span className="text-[10px] font-semibold text-white flex items-center gap-1"><Copy className="w-3 h-3 text-zinc-400"/> 8.7K</span>
              <span className="text-[9px] text-zinc-500">Copies</span>
            </div>
            <div className="text-center flex flex-col items-center gap-0.5">
              <span className="text-[10px] font-semibold text-white flex items-center gap-1"><Bookmark className="w-3 h-3 text-zinc-400"/> 4.3K</span>
              <span className="text-[9px] text-zinc-500">Saves</span>
            </div>
          </div>

          <button className="w-full bg-black/40 border border-white/20 backdrop-blur-sm rounded-xl py-2.5 text-xs font-medium text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group">
            Copy Prompt
            <Copy className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
