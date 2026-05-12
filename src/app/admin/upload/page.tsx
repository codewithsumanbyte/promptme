"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UploadCloud, Eye } from "lucide-react"
import { PromptCard } from "@/components/cards/prompt-card"
import { PromptItem } from "@/lib/store"

export default function UploadPromptPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Form state for live preview
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    promptText: "",
    category: "Image",
    aiTool: "Midjourney",
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [base64Data, setBase64Data] = useState<string>("")

  const updateForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const processFile = useCallback((file: File) => {
    if (!file || !file.type.startsWith("image/")) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const res = reader.result as string
      setPreviewUrl(res)
      setBase64Data(res)
      toast.success("Image captured")
    }
    reader.readAsDataURL(file)
  }, [])

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile()
          if (file) processFile(file)
          break
        }
      }
    }
    window.addEventListener("paste", handlePaste)
    return () => window.removeEventListener("paste", handlePaste)
  }, [processFile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const data = {
      ...formData,
      tags: "",
      referenceMedia: base64Data || "" 
    }

    try {
      const res = await fetch('/api/admin/prompts', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      })

      if (res.ok) {
        toast.success("Prompt successfully ingested")
        router.push('/admin/manage')
        router.refresh()
      } else {
        toast.error("Failed to save database record")
      }
    } catch (error) {
      toast.error("Network transport conflict")
    } finally {
      setLoading(false)
    }
  }

  // Temporary prompt item for Live Preview Rendering
  const mockPrompt: PromptItem = {
    id: "preview-mock-id",
    title: formData.title || "Live Title Preview",
    description: formData.description || "Enter a description to see the layout update in real-time right here...",
    promptText: formData.promptText || "/imagine prompt: sample prompt string",
    category: formData.category || "Image",
    aiTool: formData.aiTool || "General AI",
    tags: [],
    referenceMedia: base64Data || null,
    views: 1200,
    copies: 45,
    saves: 12,
    trendingScore: 0
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-10">
         <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
           Ingest Asset <span className="text-xs font-bold uppercase text-zinc-500 bg-white/5 px-2 py-1 rounded tracking-widest">Admin Portal</span>
         </h1>
         <p className="text-zinc-500 text-sm mt-1">Configure new prompt items and review visualization in parallel.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* LEFT: Form Editor */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-8 bg-zinc-950 border border-white/10 rounded-[2.5rem] p-8 md:p-12 w-full">
          
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Display Title</Label>
              <Input name="title" value={formData.title} onChange={updateForm} required className="bg-black border-white/10 h-12 focus:ring-1 focus:ring-white" placeholder="e.g. Neon Samurai Portrait" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Sub-Description</Label>
              <Textarea name="description" value={formData.description} onChange={updateForm} required className="bg-black border-white/10 min-h-[80px] focus:ring-1 focus:ring-white" placeholder="Brief artistic direction..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promptText" className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Prompt Engine Code</Label>
              <Textarea name="promptText" value={formData.promptText} onChange={updateForm} required className="bg-black border-white/10 min-h-[120px] font-mono text-sm focus:ring-1 focus:ring-white" placeholder="Paste actual prompt string here..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Market Segment</Label>
              <Input name="category" value={formData.category} onChange={updateForm} required className="bg-black border-white/10 focus:ring-1 focus:ring-white" placeholder="Image, Video, Chat, Coding" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aiTool" className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Execution Engine</Label>
              <Input name="aiTool" value={formData.aiTool} onChange={updateForm} required className="bg-black border-white/10 focus:ring-1 focus:ring-white" placeholder="e.g. ChatGPT, Midjourney" />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Media Canvas</Label>
            
            <div className="relative border-2 border-dashed border-white/10 rounded-3xl p-10 hover:border-white/30 transition-all group flex flex-col items-center justify-center text-center cursor-pointer bg-black">
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={handleFileChange}
                 className="absolute inset-0 opacity-0 cursor-pointer z-10"
               />
               
               {previewUrl ? (
                 <div className="relative w-full max-w-md aspect-video overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all gap-2">
                       <span className="text-xs font-bold text-white bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/20">Click to Swap</span>
                    </div>
                 </div>
               ) : (
                 <>
                   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 group-hover:scale-110 transition-all">
                      <UploadCloud className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                   </div>
                   <span className="text-base font-bold text-white mb-1">Upload Reference Media</span>
                   <span className="text-xs text-zinc-500 max-w-xs leading-relaxed">Drop image file, click to browse filesystem, or just tap **Ctrl + V** here to directly paste from clipboard.</span>
                 </>
               )}
            </div>
          </div>

          <div className="pt-4">
             <button 
               type="submit" 
               disabled={loading} 
               className="w-full bg-white text-black font-extrabold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all disabled:opacity-50 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
             >
               {loading ? "Processing Database Pipeline..." : "Commit Complete Record"}
             </button>
          </div>
        </form>

        {/* RIGHT: Live Visualizer */}
        <div className="w-full lg:w-[360px] sticky top-24 space-y-6 shrink-0">
           <div className="flex items-center gap-2 text-zinc-400 mb-4 pl-2">
              <Eye className="w-4 h-4 text-white" />
              <span className="text-sm font-bold uppercase tracking-wider text-white">Live Visualization</span>
           </div>
           
           <div className="pointer-events-none origin-top transform scale-100 lg:scale-105 xl:scale-100">
              <div className="text-[10px] text-zinc-600 uppercase font-bold mb-3 tracking-widest flex justify-between">
                 <span>Client Facade</span>
                 <span>Real-Time Stream</span>
              </div>
              <PromptCard prompt={mockPrompt} className="border-white/20 shadow-2xl ring-1 ring-white/5" />
           </div>

           <div className="bg-zinc-950/50 border border-white/5 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3">Verification Checklist</h4>
              <ul className="space-y-2 text-[11px] text-zinc-500 font-medium">
                 <li className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${formData.title ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                   Metadata String Validated
                 </li>
                 <li className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${base64Data ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                   {base64Data ? 'Image Stream Engaged' : 'Fallback Logic Applied'}
                 </li>
                 <li className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${formData.category.toLowerCase().includes('video') ? 'bg-indigo-500' : 'bg-zinc-800'}`} />
                   {formData.category.toLowerCase().includes('video') ? 'Video Container Mode' : 'Standard Layout'}
                 </li>
              </ul>
           </div>
        </div>

      </div>
    </div>
  )
}
