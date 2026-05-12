"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ModifierChip } from "./ModifierChip"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Copy, Sparkles, RefreshCcw, Wand2, Check, Trash2, BrainCircuit, Loader2 } from "lucide-react"
import { toast } from "sonner"

const MODIFIERS = [
  { label: "8k Resolution", category: "Quality", value: "8k resolution" },
  { label: "Hyperrealistic", category: "Quality", value: "hyperrealistic" },
  { label: "Unreal Engine 5", category: "Quality", value: "unreal engine 5 render" },
  { label: "Masterpiece", category: "Quality", value: "masterpiece" },
  { label: "Cinematic", category: "Style", value: "cinematic" },
  { label: "Cyberpunk", category: "Style", value: "cyberpunk aesthetic" },
  { label: "Surrealism", category: "Style", value: "surrealist style" },
  { label: "Vintage Film", category: "Style", value: "shot on 35mm film, vintage" },
  { label: "Golden Hour", category: "Lighting", value: "golden hour lighting" },
  { label: "Volumetric Lighting", category: "Lighting", value: "volumetric light rays" },
  { label: "Neon Glow", category: "Lighting", value: "neon lighting, high contrast" },
  { label: "Soft Studio Light", category: "Lighting", value: "soft studio lighting" },
  { label: "Wide Angle", category: "Perspective", value: "wide angle shot" },
  { label: "Macro", category: "Perspective", value: "extreme macro closeup" },
  { label: "Top Down", category: "Perspective", value: "overhead view, top down" },
  { label: "Mystical", category: "Atmosphere", value: "mystical atmosphere" },
  { label: "Dark Noir", category: "Atmosphere", value: "dark noir vibe" },
  { label: "Ethereal", category: "Atmosphere", value: "ethereal, dreamy" },
]

import { useSearchParams } from "next/navigation"

const categories = ["All", ...Array.from(new Set(MODIFIERS.map(m => m.category)))]

export function PromptBuilder() {
  const searchParams = useSearchParams()
  const [subject, setSubject] = useState("")
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState("All")
  
  // Initialize subject from query param if present
  useEffect(() => {
    const basePrompt = searchParams.get('base')
    if (basePrompt) {
      setSubject(basePrompt)
    }
  }, [searchParams])
  
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null)
  
  const [copied, setCopied] = useState(false)

  // Calculate manually constructed prompt
  const manualPrompt = useMemo(() => {
    if (!subject && selectedModifiers.length === 0) return ""
    
    const parts = []
    if (subject.trim()) parts.push(subject.trim())
    
    const modifierValues = selectedModifiers
      .map(label => MODIFIERS.find(m => m.label === label)?.value)
      .filter(Boolean)
      
    parts.push(...modifierValues)
    
    return parts.join(", ")
  }, [subject, selectedModifiers])

  // Current prompt state determines what we view/copy
  const activePrompt = enhancedPrompt || manualPrompt

  // Clear AI enhanced prompt whenever user modifies source content
  const clearEnhanced = () => {
    if (enhancedPrompt) setEnhancedPrompt(null)
  }

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value)
    clearEnhanced()
  }

  const toggleModifier = (label: string) => {
    clearEnhanced()
    setSelectedModifiers(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label) 
        : [...prev, label]
    )
  }

  const handleCopy = () => {
    if (!activePrompt) return
    navigator.clipboard.writeText(activePrompt)
    setCopied(true)
    toast.success("Prompt copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setSubject("")
    setSelectedModifiers([])
    setEnhancedPrompt(null)
    toast("Lab bench cleared.")
  }

  const handleEnhance = async () => {
    if (!manualPrompt) {
      toast.error("Add a subject before applying AI Enhancements.")
      return
    }

    setIsEnhancing(true)
    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: manualPrompt }),
      })

      if (!response.ok) throw new Error("Enhancement protocol failed.")

      const data = await response.json()
      setEnhancedPrompt(data.enhancedPrompt)
      toast.success("Prompt enriched by Groq Intelligence!")
    } catch (error) {
      console.error(error)
      toast.error("Could not connect to enhancement grid. Check configuration.")
    } finally {
      setIsEnhancing(false)
    }
  }

  const filteredModifiers = activeCategory === "All" 
    ? MODIFIERS 
    : MODIFIERS.filter(m => m.category === activeCategory)

  return (
    <div className="w-full grid lg:grid-cols-[1fr_380px] gap-8 items-start">
      {/* Workstation Canvas */}
      <div className="space-y-8 min-w-0">
        
        {/* Input Chamber */}
        <div className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex items-center gap-2 mb-3 md:mb-4 relative z-10">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
            <h2 className="text-base md:text-lg font-bold tracking-tight text-white">Subject Anchor</h2>
          </div>
          
          <div className="relative z-10">
            <Input
              value={subject}
              onChange={handleSubjectChange}
              placeholder="E.g., 'A futuristic robot...'"
              className="bg-black/40 border-white/10 h-12 md:h-14 text-base md:text-lg px-4 md:px-5 rounded-xl focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all duration-300 placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* The Modifier Bay */}
        <div className="space-y-5 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-2 shrink-0">
              <Wand2 className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
              Enhancement Modules
            </h2>
            
            {/* Category Pill Filters */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar -mx-1 px-1 max-w-full w-full sm:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    activeCategory === cat 
                      ? "bg-white text-black" 
                      : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            layout
            className="flex flex-wrap gap-2.5 md:gap-3 min-h-[180px] content-start p-4 md:p-6 glass rounded-2xl md:rounded-3xl border-white/5 overflow-hidden"
          >
            <AnimatePresence>
              {filteredModifiers.map((mod) => (
                <ModifierChip
                  key={mod.label}
                  label={mod.label}
                  category={mod.category}
                  isSelected={selectedModifiers.includes(mod.label)}
                  onClick={() => toggleModifier(mod.label)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Compiler Panel (Sticky Sidebar) */}
      <div className="lg:sticky lg:top-28 self-start space-y-6 pb-10 lg:pb-0 min-w-0 w-full">
        <div className="glass-card bg-zinc-950/80 rounded-2xl md:rounded-3xl border-white/10 p-5 md:p-6 flex flex-col min-h-[350px] md:min-h-[450px] shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          <div className="absolute inset-0 bg-grid-subtle opacity-30 -z-10" />
          
          {/* Background ambience when AI is active */}
          {enhancedPrompt && (
            <div className="absolute inset-0 bg-indigo-950/10 animate-pulse transition-all" />
          )}

          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-2 text-white/80">
              <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
                enhancedPrompt ? "bg-indigo-400 animate-pulse shadow-indigo-400" : "bg-emerald-500"
              }`} />
              <span className="text-xs font-mono uppercase tracking-widest font-bold">
                {enhancedPrompt ? "AI ENHANCED OUTPUT" : "RAW CONSOLE OUTPUT"}
              </span>
            </div>
            <button 
              onClick={handleClear}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-500 hover:text-rose-400"
              title="Reset everything"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Main Viewport */}
          <div className={`flex-1 bg-black/60 border rounded-2xl p-5 font-mono text-sm relative group overflow-y-auto max-h-[400px] transition-colors duration-500 ${
            enhancedPrompt ? "border-indigo-500/30 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]" : "border-white/5"
          }`}>
            
            {isEnhancing ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-indigo-400">
                <Loader2 className="w-8 h-8 mb-3 animate-spin" />
                <p className="text-xs font-bold tracking-widest animate-pulse">COMPUTING OPTIMIZATION...</p>
              </div>
            ) : activePrompt ? (
              <motion.div 
                key={enhancedPrompt ? "enhanced" : "manual"}
                initial={{ opacity: 0, filter: "blur(10px)" }} 
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5 }}
                className="text-zinc-200 leading-relaxed break-words whitespace-pre-wrap"
              >
                {enhancedPrompt ? (
                  <span className="text-white text-glow-white font-medium">{enhancedPrompt}</span>
                ) : (
                  <>
                    {subject && <span className="text-indigo-300 font-bold">{subject.trim()}</span>}
                    {subject && selectedModifiers.length > 0 && <span className="text-zinc-600">, </span>}
                    {selectedModifiers.map((label, idx) => (
                      <span key={label}>
                        <span className="text-white">
                          {MODIFIERS.find(m => m.label === label)?.value}
                        </span>
                        {idx < selectedModifiers.length - 1 && <span className="text-zinc-600">, </span>}
                      </span>
                    ))}
                  </>
                )}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600">
                <RefreshCcw className="w-8 h-8 mb-3 opacity-20 animate-spin-slow" />
                <p className="text-xs">Awaiting building blocks...</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-3 relative z-10">
            
            {/* Premium Redesigned Enhance Button */}
            <motion.button
              onClick={handleEnhance}
              disabled={isEnhancing || !manualPrompt || !!enhancedPrompt}
              whileHover={(!isEnhancing && manualPrompt && !enhancedPrompt) ? { scale: 1.02, translateY: -1 } : {}}
              whileTap={(!isEnhancing && manualPrompt && !enhancedPrompt) ? { scale: 0.98, translateY: 0 } : {}}
              className={`relative w-full h-12 rounded-xl flex items-center justify-center gap-2.5 font-black text-xs uppercase tracking-[0.1em] overflow-hidden transition-all duration-500 group shadow-2xl
                ${enhancedPrompt 
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default" 
                  : "text-white"
                }
                ${(!enhancedPrompt && !isEnhancing && manualPrompt) 
                  ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-[length:200%_auto] animate-[pulse_3s_ease-in-out_infinite] border border-white/20 hover:border-white/40" 
                  : enhancedPrompt ? "" : "bg-white/5 border border-white/5 text-zinc-500 cursor-not-allowed"
                }
              `}
            >
              {/* Dynamic Gradient Sweep overlay on hover */}
              {!enhancedPrompt && !isEnhancing && manualPrompt && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full ease-in-out transform" />
              )}

              {enhancedPrompt ? (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 relative z-10">
                  <Check className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> 
                  <span className="font-bold tracking-widest text-glow-emerald">GRID OPTIMIZED</span>
                </motion.div>
              ) : (
                <div className="flex items-center gap-2 relative z-10">
                  {isEnhancing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>SYNCING...</span>
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                      <span>ENHANCE REALITY</span>
                    </>
                  )}
                </div>
              )}
              
              {/* Internal Subtle Light Source */}
              {!enhancedPrompt && !isEnhancing && manualPrompt && (
                <div className="absolute -inset-x-20 -inset-y-10 bg-white/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full pointer-events-none" />
              )}
            </motion.button>

            {/* Copy Button */}
            <Button
              onClick={handleCopy}
              disabled={!activePrompt || isEnhancing}
              size="lg"
              className={`w-full font-bold text-sm transition-all duration-500 group h-12 rounded-xl ${
                copied 
                  ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                  : enhancedPrompt 
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white" 
                    : "bg-white text-black hover:bg-zinc-200 disabled:opacity-30"
              }`}
            >
              {copied ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> COPIED
                </motion.div>
              ) : (
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                  {enhancedPrompt ? "COPY ENHANCED PROMPT" : "COPY MASTERPIECE"}
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
