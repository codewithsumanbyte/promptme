"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Trash2, Star, Monitor, Smartphone, Tablet, Loader2, ExternalLink } from "lucide-react"

export default function ManageWallpapers() {
  const [wallpapers, setWallpapers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    try {
      const res = await fetch('/api/admin/wallpapers')
      const data = await res.json()
      setWallpapers(data)
    } catch (e) {
      toast.error("Failed retrieval cluster connection.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Engage absolute target erasure? This node is permanently wiped.")) return
    try {
      const res = await fetch(`/api/admin/wallpapers/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success("Asset purged from data arrays.")
        setWallpapers(wallpapers.filter(w => w.id !== id))
      }
    } catch (e) {
      toast.error("Purge protocol rejected.")
    }
  }

  const toggleTop = async (id: string, currentState: boolean) => {
    try {
      // Logic constraint verification: Only allowed 3 featured nodes maximum at once
      const currentTopCount = wallpapers.filter(w => w.isTop).length
      if (!currentState && currentTopCount >= 3) {
         toast.error("CRITICAL: Cap threshold reached. Disengage an existing Top node first.")
         return
      }

      const res = await fetch(`/api/admin/wallpapers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTop: !currentState })
      })
      
      if (res.ok) {
        toast.success(!currentState ? "Promoted to Orbit Rank" : "Demoted to Archive")
        fetchAll() // Reload state
      }
    } catch (e) {
      toast.error("State pivot fractured.")
    }
  }

  const getIcon = (type: string) => {
     if (type === 'mobile') return <Smartphone className="w-3.5 h-3.5" />
     if (type === 'tablet') return <Tablet className="w-3.5 h-3.5" />
     return <Monitor className="w-3.5 h-3.5" />
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl bg-black min-h-screen text-white">
       <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-8">
          <div>
             <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
               Archive Control <span className="text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded-full tracking-widest uppercase">Grid View</span>
             </h1>
             <p className="text-zinc-500 text-sm mt-1 font-medium">Perform high-level metadata manipulation and destructive triage.</p>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 p-3 rounded-xl">
             <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
             <span className="text-sm font-bold">{wallpapers.filter(w => w.isTop).length} / 3 Featured Active</span>
          </div>
       </div>

       {loading ? (
          <div className="flex justify-center py-20">
             <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          </div>
       ) : wallpapers.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem] text-zinc-500">
             No asset configurations loaded in core cache.
          </div>
       ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="border-b border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                      <th className="pb-4 pl-4">Identity</th>
                      <th className="pb-4">Hardware</th>
                      <th className="pb-4">Metrics</th>
                      <th className="pb-4">Placement</th>
                      <th className="pb-4 text-right pr-4">Override</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                   {wallpapers.map((item) => (
                      <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                         <td className="py-4 pl-4">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-16 rounded-lg overflow-hidden bg-zinc-900 border border-white/10 flex-shrink-0 relative group-hover:scale-105 transition-transform">
                                  <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                               </div>
                               <div>
                                  <p className="font-bold text-white text-sm leading-tight">{item.title}</p>
                                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-0.5">{item.category}</p>
                               </div>
                            </div>
                         </td>
                         <td className="py-4">
                            <div className="flex items-center gap-1.5 bg-white/5 w-fit px-2.5 py-1 rounded-full border border-white/5 text-[10px] font-bold uppercase text-zinc-300">
                               {getIcon(item.deviceType)}
                               {item.deviceType}
                            </div>
                         </td>
                         <td className="py-4 text-zinc-500 text-xs font-medium">
                            {item.downloads} DL | {item.views} VW
                         </td>
                         <td className="py-4">
                            <button
                               onClick={() => toggleTop(item.id, item.isTop)}
                               className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                                  item.isTop 
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                                  : 'bg-zinc-900 text-zinc-600 border border-white/5 hover:border-amber-500/30 hover:text-amber-200'
                               }`}
                            >
                               <Star className={`w-3 h-3 ${item.isTop ? 'fill-amber-400' : ''}`} />
                               {item.isTop ? 'TOP PICK' : 'STANDARDIZE'}
                            </button>
                         </td>
                         <td className="py-4 pr-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <a href={item.imageUrl} target="_blank" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                                  <ExternalLink className="w-4 h-4" />
                               </a>
                               <button 
                                  onClick={() => handleDelete(item.id)}
                                  className="p-2 rounded-lg bg-red-950/30 hover:bg-red-600 text-red-400 hover:text-white transition-colors border border-red-500/10"
                               >
                                  <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       )}
    </div>
  )
}
