"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ModifierChipProps {
  label: string
  category: string
  isSelected: boolean
  onClick: () => void
}

const categoryColors: Record<string, string> = {
  Style: "from-blue-500 to-cyan-400",
  Lighting: "from-amber-500 to-orange-400",
  Quality: "from-purple-500 to-fuchsia-400",
  Perspective: "from-emerald-500 to-teal-400",
  Artist: "from-rose-500 to-pink-400",
  Atmosphere: "from-indigo-500 to-violet-400",
}

export function ModifierChip({ label, category, isSelected, onClick }: ModifierChipProps) {
  const gradient = categoryColors[category] || "from-zinc-500 to-zinc-400"

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative px-4 py-2 rounded-full text-sm font-medium transition-all border",
        isSelected
          ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          : "bg-zinc-900/50 text-zinc-300 border-white/10 hover:border-white/20 hover:bg-zinc-900/80"
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn(
          "w-2 h-2 rounded-full bg-gradient-to-br shadow-sm transition-opacity",
          gradient,
          isSelected ? "opacity-80" : "opacity-100"
        )} />
        {label}
      </div>
      
      {/* Subtle glow under the button when selected */}
      {isSelected && (
        <motion.div
          layoutId={`glow-${label}`}
          className="absolute -inset-1 bg-white/20 blur-md rounded-full -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.button>
  )
}
