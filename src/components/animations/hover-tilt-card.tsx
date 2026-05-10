"use client"

import React, { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface HoverTiltCardProps {
  children: React.ReactNode
  className?: string
  glare?: boolean
}

export function HoverTiltCard({ children, className = "", glare = true }: HoverTiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"])
  const glareOpacity = useTransform(
    mouseXSpring,
    [-0.5, 0, 0.5],
    [0.1, 0, 0.1]
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    
    const width = rect.width
    const height = rect.height
    
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-xl transition-all duration-200 ease-in-out ${className}`}
    >
      {glare && (
        <motion.div
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)",
            opacity: glareOpacity,
            left: glareX,
            top: glareY,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
          className="absolute z-10 w-[200%] h-[200%] mix-blend-overlay rounded-xl"
        />
      )}
      {children}
    </motion.div>
  )
}
