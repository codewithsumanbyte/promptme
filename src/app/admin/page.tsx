import Link from "next/link"
import { PlusCircle, List, BarChart3, TrendingUp, Eye, ArrowUpRight, Star, ImageIcon } from "lucide-react"
import prisma from "@/lib/prisma"
import { AnalyticsDashboard } from "@/components/admin/analytics-charts"
import { Prompt } from "@prisma/client"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const totalPrompts = await prisma.prompt.count() || 0;
  
  let totalViews: { _sum: { views: number | null } } = { _sum: { views: 0 } };
  let totalCopies: { _sum: { copies: number | null } } = { _sum: { copies: 0 } };
  let topPrompts: Pick<Prompt, 'title' | 'views' | 'copies'>[] = [];

  try {
    const [viewsRes, copiesRes, promptsRes] = await Promise.all([
      prisma.prompt.aggregate({ _sum: { views: true } }),
      prisma.prompt.aggregate({ _sum: { copies: true } }),
      prisma.prompt.findMany({
        orderBy: { views: 'desc' },
        take: 5,
        select: { title: true, views: true, copies: true }
      })
    ]);
    if (viewsRes) totalViews = viewsRes as { _sum: { views: number | null } };
    if (copiesRes) totalCopies = copiesRes as { _sum: { copies: number | null } };
    if (promptsRes) topPrompts = promptsRes;
  } catch (err) {
    console.error("Admin dashboard DB fetch fail", err);
  }

  const totalV = totalViews?._sum?.views || 0;
  const totalC = totalCopies?._sum?.copies || 0;

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl bg-black text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Platform Analytics</h1>
          <p className="text-zinc-500 text-sm font-medium">Detailed metrics monitor for prompt engagement and system scale.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <Link href="/admin/upload">
             <button className="bg-white text-black font-bold py-2.5 px-6 rounded-full flex items-center gap-2 hover:bg-zinc-200 transition-colors text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
               <PlusCircle className="w-4 h-4" /> Add New Prompt
             </button>
           </Link>
        </div>
      </div>
      
      {/* Metrics Grid - Flat Minimal Outline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="border border-white/10 bg-zinc-950 p-7 rounded-3xl relative overflow-hidden group transition-all hover:border-white/20">
          <div className="flex items-center justify-between mb-4">
             <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
               <List className="w-5 h-5 text-white" />
             </div>
             <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full gap-0.5">
               <ArrowUpRight className="w-3 h-3" /> Active
             </span>
          </div>
          <div className="text-sm text-zinc-500 font-medium mb-1">Total Prompts Hosted</div>
          <div className="text-4xl font-extrabold text-white">{totalPrompts}</div>
        </div>

        <div className="border border-white/10 bg-zinc-950 p-7 rounded-3xl relative overflow-hidden group transition-all hover:border-white/20">
          <div className="flex items-center justify-between mb-4">
             <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
               <Eye className="w-5 h-5 text-white" />
             </div>
          </div>
          <div className="text-sm text-zinc-500 font-medium mb-1">Overall User Traffic</div>
          <div className="text-4xl font-extrabold text-white">
            {totalV > 1000 ? `${(totalV/1000).toFixed(1)}K` : totalV}
          </div>
        </div>

        <div className="border border-white/10 bg-zinc-950 p-7 rounded-3xl relative overflow-hidden group transition-all hover:border-white/20">
          <div className="flex items-center justify-between mb-4">
             <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
               <TrendingUp className="w-5 h-5 text-white" />
             </div>
          </div>
          <div className="text-sm text-zinc-500 font-medium mb-1">Total Prompt Actions</div>
          <div className="text-4xl font-extrabold text-white">
            {totalC > 1000 ? `${(totalC/1000).toFixed(1)}K` : totalC}
          </div>
        </div>
      </div>

      {/* REAL CHARTS SECTION */}
      <div className="mb-12">
         <AnalyticsDashboard topPrompts={topPrompts} />
      </div>

      {/* Quick Controls */}
      <div>
         <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Operational Tasks
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/admin/manage" className="group border border-white/10 bg-zinc-950 hover:bg-white/[0.03] transition-all rounded-3xl p-6 flex items-center gap-6">
               <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                 <List className="w-6 h-6 text-zinc-400" />
               </div>
               <div>
                 <h3 className="text-lg font-bold text-white mb-0.5">Library Management</h3>
                 <p className="text-sm text-zinc-500 font-medium">Edit, curate, or remove active prompt assets.</p>
               </div>
            </Link>
            
            <Link href="/admin/upload" className="group border border-white/10 bg-zinc-950 hover:bg-white/[0.03] transition-all rounded-3xl p-6 flex items-center gap-6">
               <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                 <PlusCircle className="w-6 h-6 text-zinc-400" />
               </div>
               <div>
                 <h3 className="text-lg font-bold text-white mb-0.5">Ingest Prompt</h3>
                 <p className="text-sm text-zinc-500 font-medium">Manually release a new viral prompt item.</p>
               </div>
            </Link>

            <Link href="/admin/wallpapers" className="group border border-indigo-500/30 bg-indigo-950/10 hover:bg-indigo-900/20 transition-all rounded-3xl p-6 flex items-center gap-6">
               <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                 <ImageIcon className="w-6 h-6 text-indigo-400" />
               </div>
               <div>
                 <h3 className="text-lg font-bold text-white mb-0.5">Upload Wallpaper</h3>
                 <p className="text-sm text-zinc-500 font-medium">Deploy new 4K assets straight to the cloud.</p>
               </div>
            </Link>

            <Link href="/admin/wallpapers/manage" className="group border border-white/10 bg-zinc-950 hover:bg-white/[0.03] transition-all rounded-3xl p-6 flex items-center gap-6">
               <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                 <Star className="w-6 h-6 text-zinc-400" />
               </div>
               <div>
                 <h3 className="text-lg font-bold text-white mb-0.5">Curate Wallpapers</h3>
                 <p className="text-sm text-zinc-500 font-medium">Edit, delete, or pick Top Spotlight picks.</p>
               </div>
            </Link>
         </div>
      </div>
    </div>
  )
}

