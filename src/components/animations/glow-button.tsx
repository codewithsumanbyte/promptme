"use client"

import * as React from "react"
import { HTMLMotionProps, motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlowButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode
  glowColor?: string
}

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, children, glowColor = "rgba(255,255,255,0.5)", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative group overflow-hidden rounded-full px-6 py-3 font-semibold text-foreground bg-background border border-border/50",
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <div
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl rounded-full"
          style={{
            background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`
          }}
        />
        <div className="absolute inset-0 z-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.button>
    )
  }
)
GlowButton.displayName = "GlowButton"
