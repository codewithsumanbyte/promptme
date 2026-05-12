"use client"

import React, { useState } from "react"
import { Video, ImageIcon, MessageSquare, Code, Heart, Copy, Check, Star, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { PromptItem } from "@/lib/store"
import { toast } from "sonner"

export function FeaturedCard({ prompt }: { prompt: PromptItem }) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(prompt.promptText)
    setCopied(true)
    toast.success("Prompt Copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  const hasMedia = !!(prompt.referenceMedia || prompt.thumbnail)
  const normalized = prompt.category.toLowerCase()
  const isVideo = normalized.includes("video")
  
  return (
    <div className="group relative bg-zinc-950 border border-white/[0.08] hover:border-yellow-500/30 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(234,179,8,0.15)] flex flex-col h-full max-w-sm mx-auto cursor-pointer">
      
      {/* Top Edge Feature Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
        {hasMedia ? (
          <img 
            src={prompt.referenceMedia || prompt.thumbnail || ""} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            alt="" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-900/20 via-zinc-900 to-black flex items-center justify-center">
             <MessageSquare className="w-6 h-6 text-yellow-500/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
        
        {/* Small Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-yellow-500 text-black text-[8px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-xl">
          <Star className="w-2 h-2 fill-current" /> Featured
        </div>

        {isVideo && hasMedia && (
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20">
               <Video className="w-4 h-4 text-white fill-white" />
             </div>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 relative">
         <h4 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-yellow-500 transition-colors">{prompt.title}</h4>
         <p className="text-[11px] text-zinc-400 line-clamp-2 mb-4 font-medium leading-relaxed">{prompt.description}</p>
         
         <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/[0.04]">
            <div className="flex items-center gap-1.5">
               <img src="/wtf-logo.png" className="w-4 h-4 rounded-full ring-1 ring-white/10" alt="" />
               <span className="text-[9px] font-bold text-zinc-300 flex items-center gap-1">WTF <CheckCircle className="w-2 h-2 fill-emerald-500 text-emerald-500"/></span>
            </div>
            
            <div className="flex items-center gap-3">
               <button onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-rose-400 transition-colors">
                  <Heart className={cn("w-3 h-3", liked ? "fill-rose-500 text-rose-500" : "")} />
                  {liked ? "1.4K" : "1.3K"}
               </button>
               <button onClick={handleCopy} className="text-zinc-400 hover:text-white transition-colors">
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}
