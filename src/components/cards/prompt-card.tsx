"use client"

import * as React from "react"
import { Copy, Check, Bookmark, Heart, MessageSquare, Code, Video, ImageIcon, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { PromptItem, usePromptStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface PromptCardProps {
  prompt: PromptItem
  className?: string
}

const CategoryIconMap: Record<string, React.ElementType> = {
  image: ImageIcon,
  video: Video,
  chatgpt: MessageSquare,
  chat: MessageSquare,
  coding: Code,
  code: Code,
}

export function PromptCard({ prompt, className }: PromptCardProps) {
  const [copied, setCopied] = React.useState(false)
  const [liked, setLiked] = React.useState(false)
  const [detailOpen, setDetailOpen] = React.useState(false)
  
  const isSaved = usePromptStore((state) => state.isSaved(prompt.id))
  const savePrompt = usePromptStore((state) => state.savePrompt)
  const removePrompt = usePromptStore((state) => state.removePrompt)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await navigator.clipboard.writeText(prompt.promptText)
    setCopied(true)
    toast.success("Prompt copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
    fetch(`/api/prompts/${prompt.id}/copy`, { method: 'POST' }).catch(() => {})
  }

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isSaved) {
      removePrompt(prompt.id)
    } else {
      savePrompt(prompt)
      fetch(`/api/prompts/${prompt.id}/save`, { method: 'POST' }).catch(() => {})
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLiked(!liked)
    if (!liked) {
      toast("Liked!")
      // Normally we would increment in backend here
    }
  }

  const normalizedCat = prompt.category.toLowerCase();
  const CatIcon = CategoryIconMap[normalizedCat] || ImageIcon;
  const displayImage = prompt.referenceMedia || prompt.thumbnail || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop";

  return (
    <>
      <div className={cn(
        "group block w-full bg-zinc-950/50 border border-white/[0.06] rounded-3xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] cursor-pointer", 
        className
      )} onClick={() => setDetailOpen(true)}>
        
        {/* Visual Content Body */}
        <div className="p-1.5 flex flex-col">
          
          {/* 1. Image Container */}
          <div className="relative aspect-[4/3] w-full rounded-[1.25rem] overflow-hidden bg-zinc-900 mb-4">
             <img 
               src={displayImage} 
               alt={prompt.title} 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
             />
             
             {/* Dark Gradient Overlay */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-80" />

             {/* Top Pill Overlay */}
             <div className="absolute top-3 inset-x-3 flex items-start justify-between z-10">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 py-1.5 px-3 rounded-full">
                   <CatIcon className="w-3.5 h-3.5 text-white/80" />
                   <span className="text-[11px] font-bold text-white/90 capitalize">{prompt.category}</span>
                </div>

                <button 
                  onClick={handleSave} 
                  className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                >
                   <Bookmark className={cn("w-4 h-4 transition-all", isSaved ? "fill-white text-white" : "text-white/70")} />
                </button>
             </div>
          </div>

          {/* 2. Metadata Area */}
          <div className="px-4 pb-4 flex flex-col h-full">
             <h3 className="text-[17px] font-bold text-white tracking-tight mb-2 leading-snug group-hover:text-zinc-100 transition-colors">
               {prompt.title}
             </h3>
             
             <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2 mb-6 font-medium">
               {prompt.description}
             </p>

             {/* 3. Interactive Footer */}
             <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/[0.04]">
                
                {/* User Badge - Fixed Hardcode @promptme */}
                <div className="flex items-center gap-2">
                   <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-800 border border-white/10">
                      <img src="/logo.png" className="w-full h-full object-contain bg-black" alt="promptme" />
                   </div>
                   <div className="flex items-center gap-1 text-zinc-400 font-bold text-xs">
                      <span>@promptme</span>
                      <CheckCircle className="w-3 h-3 text-emerald-500 fill-current" />
                   </div>
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-4 z-10">
                   <button onClick={handleLike} className="flex items-center gap-1 text-zinc-400 text-xs font-bold hover:text-white transition-colors">
                      <Heart className={cn("w-4 h-4 transition-colors", liked ? "fill-red-500 text-red-500" : "text-zinc-500 hover:text-red-500")} />
                      <span>{liked ? ((prompt.views/1000)+0.1).toFixed(1) : (prompt.views/1000).toFixed(1)}K</span>
                   </button>
                   
                   <button 
                     onClick={handleCopy} 
                     className={cn(
                       "p-1 text-zinc-500 hover:text-white transition-colors",
                       copied && "text-green-500 hover:text-green-500"
                     )}
                   >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                   </button>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* POPUP MODAL OVERLAY */}
      {detailOpen && (
        <div 
          className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-default animate-in fade-in duration-200"
          onClick={() => setDetailOpen(false)}
        >
           <div 
             className="bg-zinc-950 border border-white/10 rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto relative cursor-default shadow-2xl flex flex-col lg:flex-row"
             onClick={(e) => e.stopPropagation()}
           >
              {/* Left Section: Hero Image */}
              <div className="w-full lg:w-[45%] relative aspect-[4/3] lg:aspect-auto bg-zinc-900 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 shrink-0">
                 <img src={displayImage} className="w-full h-full object-cover" alt={prompt.title} />
                 <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1.5">
                   <CatIcon className="w-3 h-3" /> {prompt.category}
                 </div>
              </div>

              {/* Right Section: Content details */}
              <div className="flex-1 p-8 lg:p-10 flex flex-col overflow-y-auto">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                       <img src="/logo.png" className="w-6 h-6 rounded-full bg-black" alt="" />
                       <span className="font-bold text-xs text-zinc-400 flex items-center gap-1">@promptme <CheckCircle className="w-3 h-3 text-emerald-500 fill-current"/></span>
                    </div>
                    <button onClick={() => setDetailOpen(false)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all">
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                 </div>

                 <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight mb-4">{prompt.title}</h2>
                 <p className="text-zinc-400 text-sm mb-8 leading-relaxed">{prompt.description}</p>

                 <div className="bg-black border border-white/10 rounded-2xl p-5 mb-8 relative group">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Prompt Instruction</div>
                    <code className="text-sm text-zinc-200 font-mono break-words whitespace-pre-wrap">{prompt.promptText}</code>
                    <button 
                       onClick={handleCopy}
                       className="absolute top-4 right-4 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-200 flex items-center gap-1.5"
                    >
                       {copied ? <Check className="w-3 h-3"/> : <Copy className="w-3 h-3"/>} {copied ? "Copied" : "Copy"}
                    </button>
                 </div>

                 <div className="mt-auto flex items-center gap-4 border-t border-white/10 pt-6">
                    <button 
                      onClick={handleCopy} 
                      className="flex-1 bg-white text-black font-extrabold py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all"
                    >
                      Copy Complete Prompt <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleSave}
                      className={cn(
                        "w-14 h-14 rounded-full border flex items-center justify-center transition-all",
                        isSaved ? "bg-white text-black border-white" : "bg-transparent border-white/20 text-white hover:border-white"
                      )}
                    >
                       <Bookmark className={cn("w-5 h-5", isSaved ? "fill-current" : "")} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  )
}
