"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UploadCloud, Image as ImageIcon } from "lucide-react"

export default function UploadPromptPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [base64Data, setBase64Data] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Quick preview & convert to base64 for direct storage
    const reader = new FileReader()
    reader.onloadend = () => {
      const res = reader.result as string
      setPreviewUrl(res)
      setBase64Data(res)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      promptText: formData.get('promptText'),
      category: formData.get('category'),
      aiTool: formData.get('aiTool'),
      tags: formData.get('tags'),
      // Send our built base64 data instead of URL
      referenceMedia: base64Data || "" 
    }

    try {
      const res = await fetch('/api/admin/prompts', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      })

      if (res.ok) {
        toast.success("Prompt saved to database locally")
        router.push('/admin/manage')
        router.refresh()
      } else {
        toast.error("Database storage failed")
      }
    } catch (error) {
      toast.error("Network transport error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
         <h1 className="text-3xl font-extrabold text-white tracking-tight">Ingest Asset</h1>
         <p className="text-zinc-500 text-sm mt-1">Populate the library with high-fidelity prompts and artifacts.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-950 border border-white/10 rounded-[2rem] p-8 md:p-10">
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Internal Title</Label>
            <Input id="title" name="title" required className="bg-black border-white/10 h-12 focus:ring-1 focus:ring-white" placeholder="Cinematic Cyberpunk" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Description Narrative</Label>
            <Textarea id="description" name="description" required className="bg-black border-white/10 min-h-[80px] focus:ring-1 focus:ring-white" placeholder="High level details of the style..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="promptText" className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Executable String</Label>
            <Textarea id="promptText" name="promptText" required className="bg-black border-white/10 min-h-[120px] font-mono text-sm focus:ring-1 focus:ring-white" placeholder="/imagine prompt: ..." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Niche Vertical</Label>
            <Input id="category" name="category" required className="bg-black border-white/10 focus:ring-1 focus:ring-white" placeholder="e.g. Image" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aiTool" className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Execution Engine</Label>
            <Input id="aiTool" name="aiTool" required className="bg-black border-white/10 focus:ring-1 focus:ring-white" placeholder="Midjourney v6" />
          </div>
        </div>

        {/* FILE UPLOAD BLOCK */}
        <div className="space-y-3">
          <Label className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Reference Object Media</Label>
          
          <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all group flex flex-col items-center justify-center text-center cursor-pointer bg-black">
             <input 
               type="file" 
               accept="image/*" 
               onChange={handleFileChange}
               className="absolute inset-0 opacity-0 cursor-pointer z-10"
             />
             
             {previewUrl ? (
               <div className="relative w-full aspect-video max-h-48 overflow-hidden rounded-lg">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                     <span className="text-xs font-bold text-white">Swap Image</span>
                  </div>
               </div>
             ) : (
               <>
                 <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors">
                    <UploadCloud className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                 </div>
                 <span className="text-sm font-bold text-white mb-1">Upload from File System</span>
                 <span className="text-xs text-zinc-500">Drop image here or click to browse</span>
               </>
             )}
          </div>
        </div>

        <div className="pt-4">
           <button 
             type="submit" 
             disabled={loading} 
             className="w-full bg-white text-black font-extrabold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all disabled:opacity-50"
           >
             {loading ? "Processing Ingestion..." : "Commit to Database"}
           </button>
        </div>

      </form>
    </div>
  )
}
