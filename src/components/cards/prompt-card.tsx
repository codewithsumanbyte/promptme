"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Copy, Check, Bookmark, Heart, MessageSquare, Code, Video, ImageIcon, CheckCircle, LucideIcon, Zap } from "lucide-react"
import { toast } from "sonner"
import { PromptItem, usePromptStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface PromptCardProps {
  prompt: PromptItem
  className?: string
  variant?: "default" | "compact"
}

const CategoryIconMap: Record<string, LucideIcon> = {
  image: ImageIcon,
  video: Video,
  chatgpt: MessageSquare,
  chat: MessageSquare,
  coding: Code,
  code: Code,
}

export function PromptCard({ prompt, className, variant = "default" }: PromptCardProps) {
  const router = useRouter()
  const [copied, setCopied] = React.useState(false)
  const [liked, setLiked] = React.useState(false)
  const [detailOpen, setDetailOpen] = React.useState(false)
  
  const handleModifyInLab = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/lab?base=${encodeURIComponent(prompt.promptText)}`)
  }
  
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
  const isVideo = normalizedCat.includes("video");
  
  const hasMedia = !!(prompt.referenceMedia || prompt.thumbnail);
  const displayImage = prompt.referenceMedia || prompt.thumbnail || "";

  return (
    <>
      {variant === "compact" ? (
        /* COMPACT ULTRA PREMIUM VARIANT (for Top Picks) */
        <div 
          className={cn(
            "group relative bg-zinc-950 border border-white/[0.08] hover:border-yellow-500/30 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-12px_rgba(234,179,8,0.12)] flex flex-col h-full w-full cursor-pointer max-w-md mx-auto",
            className
          )}
          onClick={() => setDetailOpen(true)}
        >
          {/* Feature Top Glow Bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
          
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900 border-b border-white/5">
            {hasMedia ? (
              <img src={displayImage} className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-1000" alt="" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 flex items-center justify-center">
                 <MessageSquare className="w-6 h-6 text-white/10" />
              </div>
            )}
            
            {/* Dark Overlay Grads */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Minimal Category Label */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
               <CatIcon className="w-3 h-3 text-zinc-300" />
               <span className="text-[9px] font-black text-white uppercase tracking-wider">{prompt.category}</span>
            </div>
 
            {/* Save Button Overlay for consistency */}
            <button 
              onClick={handleSave} 
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
               <Bookmark className={cn("w-3 h-3", isSaved ? "fill-current text-emerald-400" : "")} />
            </button>

            {isVideo && hasMedia && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                     <Video className="w-4 h-4 fill-white text-white" />
                  </div>
               </div>
            )}
          </div>

          <div className="p-4 flex flex-col flex-1 relative z-10 bg-zinc-950">
             <h4 className="text-[15px] font-extrabold text-white mb-1.5 line-clamp-1 leading-snug tracking-tight group-hover:text-yellow-200 transition-colors">
               {prompt.title}
             </h4>
             <p className="text-[11px] text-zinc-500 font-medium leading-relaxed line-clamp-2 mb-4">
               {prompt.description}
             </p>

             <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                   <img src="/wtf-logo.png" className="w-4 h-4 rounded-full overflow-hidden ring-1 ring-white/10" alt="" />
                   <span className="text-[10px] font-extrabold text-zinc-400 flex items-center gap-1 uppercase">WTF <CheckCircle className="w-2 h-2 fill-emerald-500 text-emerald-500"/></span>
                </div>
                
                <div className="flex items-center gap-3">
                   <button onClick={handleLike} className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-rose-400 transition-colors">
                      <Heart className={cn("w-3 h-3", liked ? "fill-rose-500 text-rose-500" : "")} />
                      {liked ? ((prompt.views/1000)+0.1).toFixed(1) : (prompt.views/1000).toFixed(1)}K
                   </button>
                   <button onClick={handleModifyInLab} title="Modify in Lab" className="text-zinc-500 hover:text-amber-400 transition-colors">
                      <Zap className="w-3.5 h-3.5" />
                   </button>
                   <button onClick={handleCopy} className="text-zinc-500 hover:text-white transition-colors">
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                   </button>
                </div>
             </div>
          </div>
        </div>
      ) : (
        /* STANDARD PREMIUM VARIANT (Main Grid) */
        <div className={cn(
          "group relative block w-full bg-gradient-to-b from-zinc-900/50 to-black border border-white/[0.05] rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-white/20 cursor-pointer hover:-translate-y-1.5", 
          className
        )} onClick={() => setDetailOpen(true)}>
          
          {/* Subtle Glow Background on Hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-500 pointer-events-none" />
  
          {/* Visual Content Body */}
          <div className="p-2 flex flex-col h-full relative z-10">
            
            {hasMedia ? (
              /* 1. Image Container with Rich Hover Effects */
              <div className="relative aspect-[5/4] w-full rounded-[1.5rem] overflow-hidden bg-zinc-900/50 mb-4 ring-1 ring-white/10">
                 <img 
                   src={displayImage} 
                   alt={prompt.title} 
                   className="w-full h-full object-cover scale-100 group-hover:scale-[1.08] transition-transform duration-1000 ease-out"
                 />
                 
                 {/* Smooth Darkening Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
  
                 {/* Floating Video Pill for visual consistency */}
                 {isVideo && (
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-2xl transform scale-100 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
                         <Video className="w-6 h-6 fill-white" />
                      </div>
                   </div>
                 )}
    
                 {/* Floating Label Row */}
                 <div className="absolute top-3.5 inset-x-3.5 flex items-start justify-between z-10">
                    <div className="flex items-center gap-2 bg-zinc-950/60 backdrop-blur-xl border border-white/15 py-1.5 px-3.5 rounded-full shadow-lg">
                       <CatIcon className="w-3.5 h-3.5 text-zinc-200" />
                       <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">{prompt.category}</span>
                    </div>
    
                    <button 
                      onClick={handleSave} 
                      className="w-10 h-10 rounded-full bg-zinc-950/60 backdrop-blur-xl border border-white/15 flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-lg"
                    >
                       <Bookmark className={cn("w-4 h-4 transition-colors", isSaved ? "fill-current text-emerald-500" : "text-white")} />
                    </button>
                 </div>
              </div>
            ) : (
              /* 1b. Highly Stylized Text-Only Card */
              <div className="relative aspect-[5/4] w-full rounded-[1.5rem] overflow-hidden mb-4 bg-gradient-to-tr from-[#0F0C29] via-[#302b63] to-[#24243e] flex items-center justify-center p-8 ring-1 ring-white/10">
                 <div className="absolute inset-0 opacity-20 bg-grid-subtle pointer-events-none mix-blend-overlay" />
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />
                 
                 <div className="relative z-10 text-center flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                       <MessageSquare className="w-5 h-5 text-white/70" />
                    </div>
                    <span className="text-lg lg:text-xl font-black text-white text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 leading-tight line-clamp-3 italic tracking-tight">
                      "{prompt.description}"
                    </span>
                 </div>
  
                 {/* Floating Category Overlay for Text Cards */}
                 <div className="absolute top-3.5 inset-x-3.5 flex items-start justify-between z-10">
                    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 py-1.5 px-3.5 rounded-full">
                       <CatIcon className="w-3.5 h-3.5 text-zinc-300" />
                       <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">{prompt.category}</span>
                    </div>
    
                    <button 
                      onClick={handleSave} 
                      className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                    >
                       <Bookmark className={cn("w-4 h-4", isSaved ? "fill-current text-emerald-500" : "text-white")} />
                    </button>
                 </div>
              </div>
            )}
  
            {/* 2. Text Metadata Space */}
            <div className="px-3 pb-3 pt-1 flex flex-col h-full">
               <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-extrabold text-white tracking-tight leading-[1.3] group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {prompt.title}
                  </h3>
               </div>
               
               {hasMedia ? (
                 <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 mb-6 font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                   {prompt.description}
                 </p>
               ) : (
                 <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 mb-6 backdrop-blur-sm">
                   <code className="text-[11px] font-mono text-indigo-200/70 line-clamp-2 block leading-relaxed">
                     {prompt.promptText}
                   </code>
                 </div>
               )}
  
               {/* 3. Sleek Premium Footer */}
               <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.08]">
                  
                  {/* User Credentials */}
                  <div className="flex items-center gap-2.5">
                     <div className="w-7 h-7 rounded-full overflow-hidden bg-black ring-1 ring-white/20 p-0.5">
                        <div className="w-full h-full rounded-full overflow-hidden bg-zinc-800">
                           <img src="/wtf-logo.png" className="w-full h-full object-contain" alt="wtfprompt" />
                        </div>
                     </div>
                     <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                           <span className="text-white font-bold text-[11px] tracking-wide">WTFPROMPT</span>
                           <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Admin Verified</span>
                     </div>
                  </div>
  
                  {/* Action Array */}
                  <div className="flex items-center gap-2.5 z-10">
                     <button onClick={handleLike} className="flex items-center gap-1 text-zinc-400 text-xs font-black hover:text-white transition-colors">
                        <Heart className={cn("w-3.5 h-3.5 transition-all duration-300 transform", liked ? "fill-rose-500 text-rose-500 scale-110" : "text-zinc-500 hover:text-rose-400")} />
                        <span className={cn("text-[10px]", liked && "text-rose-500")}>{liked ? ((prompt.views/1000)+0.1).toFixed(1) : (prompt.views/1000).toFixed(1)}K</span>
                     </button>
                     
                     <div className="h-3 w-[1px] bg-white/10" />
                     
                     <button 
                       onClick={handleModifyInLab} 
                       title="Modify in Lab"
                       className="flex items-center justify-center h-7 w-7 rounded-full hover:bg-amber-500/10 text-zinc-400 hover:text-amber-400 transition-all duration-300"
                     >
                        <Zap className="w-3.5 h-3.5" />
                     </button>
  
                     <button 
                       onClick={handleCopy} 
                       className={cn(
                         "flex items-center justify-center h-7 w-7 rounded-full transition-all duration-300",
                         copied ? "bg-emerald-500/20 text-emerald-400" : "hover:bg-white/10 text-zinc-400 hover:text-white"
                       )}
                     >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                     </button>
                  </div>
               </div>
            </div>
  
          </div>
        </div>
      )}

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
              {/* Left Section: Hero Image / Layout */}
              {hasMedia ? (
                <div className="w-full lg:w-[45%] relative aspect-[4/3] lg:aspect-auto bg-zinc-900 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 shrink-0">
                   <img src={displayImage} className="w-full h-full object-cover" alt={prompt.title} />
                   <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1.5">
                     <CatIcon className="w-3 h-3" /> {prompt.category}
                   </div>
                   {isVideo && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center border border-white/20 text-white">
                          <Video className="w-7 h-7 fill-white" />
                        </div>
                     </div>
                   )}
                </div>
              ) : (
                <div className="w-full lg:w-[45%] relative aspect-[4/3] lg:aspect-auto bg-zinc-950 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 shrink-0 flex flex-col items-center justify-center text-center p-12">
                   <div className="absolute inset-0 opacity-10 bg-grid-subtle pointer-events-none" />
                   <MessageSquare className="w-12 h-12 text-zinc-800 mb-6" />
                   <div className="text-xl font-bold text-zinc-400 max-w-xs">Text-Driven Concept Prompt</div>
                </div>
              )}

              {/* Right Section: Content details */}
              <div className="flex-1 p-8 lg:p-10 flex flex-col overflow-y-auto">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                       <img src="/wtf-logo.png" className="w-6 h-6 rounded-full bg-black" alt="" />
                       <span className="font-bold text-xs text-zinc-400 flex items-center gap-1">@wtfprompt <CheckCircle className="w-3 h-3 text-emerald-500 fill-current"/></span>
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

                 <div className="mt-auto grid grid-cols-2 sm:grid-cols-12 gap-3 border-t border-white/10 pt-6 items-stretch">
                    <button 
                      onClick={handleModifyInLab} 
                      className="col-span-2 sm:col-span-7 bg-white text-black font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)]"
                    >
                      Modify in Lab <Zap className="w-4.5 h-4.5 fill-black" />
                    </button>
                    
                    <button 
                      onClick={handleCopy} 
                      className="col-span-1 sm:col-span-3 bg-white/[0.05] border border-white/10 text-white font-bold py-4 px-2 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/[0.1] hover:border-white/20 transition-all active:scale-[0.98]"
                    >
                      Copy <Copy className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={handleSave}
                      className={cn(
                        "col-span-1 sm:col-span-2 py-4 rounded-2xl border flex items-center justify-center transition-all active:scale-[0.95]",
                        isSaved ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/[0.03] border-white/10 text-white hover:border-white/30 hover:bg-white/[0.08]"
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
