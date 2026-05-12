"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Trash2, TrendingUp, Eye, Copy, ExternalLink, Flame, Star, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { Prompt } from "@prisma/client"

export default function ManagePromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = ["all", "image", "video", "chatgpt", "career", "coding"]

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await fetch('/api/prompts') 
        if (res.ok) {
          const data = await res.json()
          setPrompts(data)
        }
      } catch (error) {
        toast.error("Failed to load prompts")
      } finally {
        setLoading(false)
      }
    }
    fetchPrompts()
  }, [])

  const handleToggle = async (id: string, action: string, currentValue: boolean | number) => {
    try {
      const newValue = !currentValue;
      const res = await fetch(`/api/admin/prompts/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, value: newValue })
      });

      if (res.ok) {
        toast.success("Promotion status updated");
        setPrompts(prompts.map(p => {
          if (p.id !== id) return p;
          if (action === 'toggleFeatured') return { ...p, featured: newValue };
          if (action === 'toggleTrending') return { ...p, trendingScore: newValue ? 9999 : 0 };
          return p;
        }));
      } else {
        toast.error("Status update failed");
      }
    } catch (err) {
      toast.error("Error occurred updating status");
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return

    try {
      const res = await fetch(`/api/admin/prompts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success("Prompt deleted")
        setPrompts(prompts.filter(p => p.id !== id))
      } else {
        toast.error("Failed to delete")
      }
    } catch (error) {
      toast.error("Error occurred")
    }
  }

  const filteredPrompts = prompts.filter(p => {
    if (activeCategory === "all") return true;
    return p.category?.toLowerCase().includes(activeCategory);
  });

  if (loading) return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex items-center justify-between mb-10">
        <div>
           <h1 className="text-3xl font-extrabold tracking-tight text-white">Asset Registry</h1>
           <p className="text-zinc-500 text-sm mt-1">View and manage published directory entries.</p>
        </div>
        <Link href="/admin/upload">
          <button className="px-6 py-3 rounded-full bg-white text-black font-extrabold text-sm hover:bg-zinc-200 transition-all">
            + Ingest New
          </button>
        </Link>
      </div>

      {/* FILTERS TABS */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-6">
         {categories.map(cat => (
           <button 
             key={cat}
             onClick={() => setActiveCategory(cat)}
             className={cn(
               "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all",
               activeCategory === cat 
                 ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                 : "bg-transparent border-white/10 text-zinc-400 hover:text-white hover:border-white/30"
             )}
           >
             {cat}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredPrompts.length > 0 ? filteredPrompts.map((prompt) => (
          <div key={prompt.id} className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all">
            <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-6">
              
              <div className="flex items-center gap-5 flex-1 w-full">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-white/5 flex items-center justify-center">
                  {(prompt.referenceMedia || prompt.thumbnail) ? (
                    <img 
                      src={prompt.referenceMedia || prompt.thumbnail || ""} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <MessageSquare className="h-6 w-6 text-zinc-700" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="font-bold text-white truncate max-w-xs md:max-w-md">{prompt.title}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                      {prompt.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-5 text-xs font-medium text-zinc-500">
                    <span className="flex items-center gap-1.5"><Eye className="h-3 w-3"/> {prompt.views}</span>
                    <span className="flex items-center gap-1.5"><Copy className="h-3 w-3"/> {prompt.copies}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0 ml-auto md:ml-0">
                <button 
                  title="Pin to Landing Top 3"
                  onClick={() => handleToggle(prompt.id, 'toggleFeatured', prompt.featured)}
                  className={cn("h-10 w-10 rounded-full flex items-center justify-center border transition-all", prompt.featured ? "bg-yellow-500/10 border-yellow-500 text-yellow-500" : "border-white/10 text-zinc-600 hover:border-white hover:text-zinc-300")}
                >
                  <Star className={cn("h-4 w-4", prompt.featured && "fill-yellow-500")} />
                </button>
                <button 
                  title="Promote to Trending"
                  onClick={() => handleToggle(prompt.id, 'toggleTrending', prompt.trendingScore > 100)}
                  className={cn("h-10 w-10 rounded-full flex items-center justify-center border transition-all mr-2", prompt.trendingScore > 100 ? "bg-orange-500/10 border-orange-500 text-orange-500" : "border-white/10 text-zinc-600 hover:border-white hover:text-zinc-300")}
                >
                  <Flame className={cn("h-4 w-4", prompt.trendingScore > 100 && "fill-orange-500")} />
                </button>

                <Link href={`/prompt/${prompt.id}`} target="_blank">
                  <button className="h-10 px-4 text-xs font-bold rounded-full flex items-center justify-center border border-white/10 text-zinc-400 hover:border-white hover:text-white transition-all">
                    View <ExternalLink className="h-3 w-3 ml-1.5" />
                  </button>
                </Link>
                <button 
                  className="h-10 w-10 rounded-full flex items-center justify-center bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                  onClick={() => handleDelete(prompt.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

            </div>
          </div>
        )) : (
          <div className="text-center py-24 text-zinc-600 border border-dashed border-white/10 rounded-[2rem] font-medium">
            Database is currently empty.
          </div>
        )}
      </div>
    </div>
  )
}
