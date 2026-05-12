"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadCloud, Smartphone, Monitor, Tablet, Image as ImageIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AdminWallpaperUpload() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Abstract",
    deviceType: "desktop",
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const updateForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const processFile = useCallback((file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Valid high-res image payload required.")
      return
    }
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    toast.success("Image captured successfully!")
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
    if (!selectedFile) {
      toast.error("Attach an asset payload to transmit.")
      return
    }
    
    setLoading(true)
    const fileExt = selectedFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `uploads/${fileName}`

    try {
      // 1. Stream Payload straight to Cloud Storage Bucket
      toast.info("Initiating Cloud Stream...")
      const { error: uploadError } = await supabase.storage
        .from('wallpapers')
        .upload(filePath, selectedFile, { upsert: true })

      if (uploadError) throw uploadError

      // 2. Retrieve Permitted Public URI
      const { data: { publicUrl } } = supabase.storage
        .from('wallpapers')
        .getPublicUrl(filePath)

      // 3. Ingest Metadata record via Grid API
      toast.info("Writing metadata sync node...")
      const apiRes = await fetch('/api/admin/wallpapers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrl: publicUrl
        })
      })

      if (!apiRes.ok) throw new Error("Metadata pipeline fractured.")

      toast.success("Deployment Successful! Asset live on network.")
      router.push('/admin') // Return to dashboard root
    } catch (err: any) {
      console.error(err)
      toast.error(`SYSTEM OVERLOAD: ${err.message || 'Stream Failure'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Ingest <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">WTFwallpaper</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Cloud gateway for ultra-high resolution visual assets.</p>
        </div>
        <div className="hidden md:flex gap-2 bg-white/[0.03] border border-white/5 rounded-xl p-1">
          <div className="p-2 bg-white/10 rounded-lg"><ImageIcon className="w-5 h-5 text-white" /></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
        
        {/* Left column: Meta inputs */}
        <div className="space-y-6 bg-zinc-950 border border-white/10 rounded-[2.5rem] p-8">
          <div className="space-y-2">
            <Label className="text-zinc-400 text-xs uppercase tracking-widest font-bold">System Identity (Title)</Label>
            <Input 
              name="title" 
              value={formData.title} 
              onChange={updateForm} 
              required 
              className="bg-black border-white/10 h-12 focus:ring-1 focus:ring-violet-500 text-lg" 
              placeholder="e.g. 'Cybergoth City 4K'" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-widest font-bold">Sector (Category)</Label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={updateForm}
                className="w-full h-10 rounded-md border border-white/10 bg-black text-white px-3 text-sm focus:ring-1 focus:ring-white appearance-none"
              >
                <option value="Abstract">🌌 Abstract</option>
                <option value="Cyberpunk">🌆 Cyberpunk</option>
                <option value="Anime">🌸 Anime</option>
                <option value="Dark Mode">🌒 Dark Mode</option>
                <option value="Nature">🌿 Nature & Landscape</option>
                <option value="Minimal">⚪ Minimal</option>
                <option value="Space">🚀 Space</option>
                <option value="Neon">🌈 Neon Lights</option>
                <option value="Gaming">🎮 Gaming</option>
                <option value="Vehicles">🏎️ Vehicles</option>
                <option value="Architecture">🏛️ Architecture</option>
                <option value="Textures">🎞️ Textures</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-widest font-bold">Hardware Matrix (Device)</Label>
              <select 
                name="deviceType" 
                value={formData.deviceType} 
                onChange={updateForm}
                className="w-full h-10 rounded-md border border-white/10 bg-black text-white px-3 text-sm focus:ring-1 focus:ring-white"
              >
                <option value="desktop">🖥️ Desktop Monitor</option>
                <option value="mobile">📱 Mobile Handset</option>
                <option value="tablet">📟 Tablet Core</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black py-4 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-violet-900/20 disabled:opacity-40"
            >
              {loading ? "STREAMING TO ORBIT..." : "AUTHORIZE UPLOAD"}
            </button>
          </div>
        </div>

        {/* Right column: Drag & Drop */}
        <div className="space-y-4">
          <Label className="text-zinc-400 text-xs uppercase tracking-widest font-bold pl-1">Visual Matrix Input</Label>
          
          <div className="relative aspect-[3/4] border-2 border-dashed border-white/10 rounded-[2rem] bg-zinc-950 hover:border-violet-500/50 hover:bg-zinc-900/30 transition-all group cursor-pointer flex items-center justify-center overflow-hidden">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
            />
            
            {previewUrl ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/90">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-70 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <span className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">SWAP ASSET</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center px-6 z-0">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-violet-500/10 transition-colors">
                  <UploadCloud className="w-6 h-6 text-zinc-500 group-hover:text-violet-400 transition-colors" />
                </div>
                <p className="text-white font-bold text-sm mb-1">Deploy Media</p>
                <p className="text-zinc-600 text-[10px] leading-tight">Drag, click, or **Ctrl + V** to paste.</p>
              </div>
            )}
          </div>

          <div className="bg-zinc-950 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                {formData.deviceType === 'mobile' ? <Smartphone className="w-5 h-5 text-emerald-400" /> : 
                 formData.deviceType === 'tablet' ? <Tablet className="w-5 h-5 text-cyan-400" /> :
                 <Monitor className="w-5 h-5 text-indigo-400" />}
             </div>
             <div>
                <p className="text-xs font-bold text-white">Targeting Mode</p>
                <p className="text-[10px] text-zinc-500 uppercase">{formData.deviceType} resolution detected</p>
             </div>
          </div>
        </div>

      </form>
    </div>
  )
}
