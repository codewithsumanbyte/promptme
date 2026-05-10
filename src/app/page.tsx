import { Flame, ArrowRight, TrendingUp, Search, MessageSquare, Image, Video, Code, Briefcase, Target, Play, Zap, BarChart3, Grid, Users, Stars } from "lucide-react"
import Link from "next/link"
import { HeroCard3D } from "@/components/3d/hero-card-3d"
import prisma from "@/lib/prisma"
import { PromptCard } from "@/components/cards/prompt-card"

export const dynamic = 'force-dynamic'

const CATEGORIES = [
  { name: "Image", icon: <Image className="w-7 h-7 text-white/80" />, count: "Prompts" },
  { name: "Video", icon: <Video className="w-7 h-7 text-white/80" />, count: "Prompts" },
  { name: "ChatGPT", icon: <MessageSquare className="w-7 h-7 text-white/80" />, count: "Prompts" },
  { name: "Coding", icon: <Code className="w-7 h-7 text-white/80" />, count: "Prompts" },
  { name: "Career", icon: <Briefcase className="w-7 h-7 text-white/80" />, count: "Prompts" },
  { name: "Marketing", icon: <Target className="w-7 h-7 text-white/80" />, count: "Prompts" },
  { name: "YouTube", icon: <Play className="w-7 h-7 text-white/80" />, count: "Prompts" },
  { name: "Productivity", icon: <Zap className="w-7 h-7 text-white/80" />, count: "Prompts" },
  { name: "Business", icon: <BarChart3 className="w-7 h-7 text-white/80" />, count: "Prompts" },
  { name: "More", icon: <Grid className="w-7 h-7 text-white/80" />, count: "Categories" },
]

export default async function Home() {
  // Fetch Curated Top 3 from admin selections
  const featuredData = await prisma.prompt.findMany({
    where: { featured: true },
    take: 3,
    orderBy: { createdAt: 'desc' }
  })

  const featuredPrompts = featuredData.map(p => ({
    ...p,
    tags: p.tags ? p.tags.split(',') : []
  }))

  return (
    <div className="flex-1 w-full bg-black text-white relative overflow-hidden">
      
      {/* Abstract background effects */}
      <div className="absolute top-[20%] right-0 w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none" />
      
      {/* Main Content Body */}
      <main className="container mx-auto px-6 lg:px-12 z-10 relative">
        
        {/* HERO SECTION */}
        <section className="pt-24 pb-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          
          {/* Left Side */}
          <div className="flex flex-col items-start">
            
            {/* Logo Injection to Hero */}
            <div className="mb-10">
              <img src="/logo.png" alt="PromptMe" className="h-20 md:h-28 w-auto object-contain -ml-2" />
            </div>

            {/* Upper Pill Badge Row */}
            <div className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-full pl-1.5 pr-5 py-1.5 mb-10">
               <div className="bg-black border border-white/20 rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-medium shadow-sm">
                 <Flame className="w-3.5 h-3.5 text-white fill-white" />
                 Trending Now
               </div>
               <div className="flex -space-x-2 items-center ml-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-6 h-6 rounded-full border border-black bg-zinc-800 overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" className="w-full h-full object-cover grayscale" />
                   </div>
                 ))}
               </div>
               <span className="text-[11px] text-zinc-400 font-medium ml-1">12.4K+ prompts used today</span>
            </div>

            <h1 className="text-6xl md:text-7xl xl:text-8xl font-extrabold tracking-tighter text-white mb-8 leading-[0.9]">
              Discover <span className="relative inline-block">
                Viral
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-white" viewBox="0 0 200 15" fill="none"><path d="M2 12.5C40 2.5 120 2.5 198 12.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>
              </span><br/>
              AI Prompts
            </h1>

            <p className="text-lg text-zinc-400 max-w-md mb-12 leading-relaxed">
              Find the most powerful AI prompts for images, videos, coding, writing, marketing and more.
            </p>

            <div className="flex flex-wrap items-center gap-5">
               <Link href="/explore">
                 <button className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-zinc-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                   Explore Prompts <ArrowRight className="w-5 h-5" />
                 </button>
               </Link>

               <Link href="/trending">
                 <button className="bg-black text-white border border-white/20 px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:border-white transition-all">
                   Trending Today <TrendingUp className="w-5 h-5 text-zinc-400" />
                 </button>
               </Link>
            </div>
          </div>

          {/* Right Side 3D Container */}
          <div className="flex justify-center lg:justify-end w-full">
            <HeroCard3D />
          </div>
        </section>

        {/* TOP 3 PICKS SECTION */}
        {featuredPrompts.length > 0 && (
          <section className="pb-24">
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                    <Stars className="w-5 h-5 fill-current" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Top Prompts Today</h2>
               </div>
               <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-white/10 to-transparent mx-8" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
               {featuredPrompts.map(prompt => (
                  <PromptCard key={prompt.id} prompt={prompt} />
               ))}
            </div>
          </section>
        )}

        {/* TRUST / CATEGORY LABELS SECTION */}
        <section className="py-10 flex flex-col items-center text-center mb-24">
          <p className="text-sm text-zinc-500 font-medium mb-8 tracking-wide">
            Loved by 50,000+ creators, developers & businesses
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
            {["Content Creators", "Developers", "Designers", "Students", "Marketers"].map((item, idx) => (
              <div key={idx} className="bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] px-6 py-3 rounded-full flex items-center gap-2 text-xs font-medium text-zinc-300 transition-all cursor-default">
                {idx === 0 && <Video className="w-3.5 h-3.5" />}
                {idx === 1 && <Code className="w-3.5 h-3.5" />}
                {idx === 2 && <Image className="w-3.5 h-3.5" />}
                {idx === 3 && <Briefcase className="w-3.5 h-3.5" />}
                {idx === 4 && <Target className="w-3.5 h-3.5" />}
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="pb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
             <div>
               <h2 className="text-2xl md:text-3xl font-bold text-white">Browse Prompts By Categories</h2>
             </div>
             <Link href="/categories" className="group inline-flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-full pl-5 pr-3 py-2 mt-4 md:mt-0 hover:border-white/20 transition-all">
               <span className="text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">View all categories</span>
               <div className="bg-white/[0.05] p-1.5 rounded-full group-hover:bg-white/10 transition-colors">
                 <ArrowRight className="w-3.5 h-3.5 text-zinc-300" />
               </div>
             </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((category, idx) => (
              <Link 
                href={`/explore?category=${category.name.toLowerCase()}`} 
                key={idx}
                className="group relative block bg-black border border-white/10 rounded-2xl p-8 overflow-hidden hover:bg-white/[0.02] hover:border-white/30 transition-all"
              >
                <div className="flex flex-col items-center justify-center text-center h-full group-hover:-translate-y-1 transition-transform duration-300">
                   <div className="mb-5 p-4 rounded-xl bg-white/[0.03] group-hover:bg-white/[0.08] transition-colors">
                     {category.icon}
                   </div>
                   <span className="font-bold text-base text-white mb-1">{category.name}</span>
                   <span className="text-xs text-zinc-500 font-medium">{category.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
