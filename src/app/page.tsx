import { Flame, ArrowRight, TrendingUp, Search, MessageSquare, Image, Video, Code, Briefcase, Target, Play, Zap, BarChart3, Grid, Users, Stars } from "lucide-react"
import Link from "next/link"
import { HeroCard3D } from "@/components/3d/hero-card-3d"
import prisma from "@/lib/prisma"
import { PromptCard } from "@/components/cards/prompt-card"
import { InstallPwaButton } from "@/components/layout/install-pwa-button"

export const dynamic = 'force-dynamic'


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

  // Fetch Curated Top Wallpapers for Spotlight
  const topWallpapers = await prisma.wallpaper.findMany({
    where: { isTop: true },
    take: 3,
    orderBy: { createdAt: 'desc' }
  })

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
              <img src="/wtf-logo.png" alt="WTFprompt" className="h-20 md:h-28 w-auto object-contain -ml-2" />
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
               <InstallPwaButton />
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

            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 relative z-10">
               {featuredPrompts.map(prompt => (
                  <PromptCard key={prompt.id} prompt={prompt} variant="compact" />
               ))}
            </div>
          </section>
        )}

        {/* NEW: TOP SPOTLIGHT WALLPAPERS */}
        {topWallpapers.length > 0 && (
          <section className="pb-24">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                     <Image className="w-5 h-5" />
                   </div>
                   <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">Featured Wallpapers</h2>
                      <p className="text-xs text-zinc-500 font-medium tracking-wide mt-0.5">Ultra-premium visuals curated by the grid controllers.</p>
                   </div>
                </div>
                <Link href="/wallpapers" className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-all">
                   View All <ArrowRight className="w-3 h-3" />
                </Link>
             </div>

             <div className="flex md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto overflow-x-auto md:overflow-visible snap-x snap-mandatory hide-scrollbar pb-8 md:pb-0 px-4 md:px-0 -mx-4 md:mx-auto">
                {topWallpapers.map((paper) => (
                  <Link 
                    href="/wallpapers" 
                    key={paper.id} 
                    className="group relative aspect-[3/4] md:aspect-[3/4] w-[85vw] md:w-auto shrink-0 md:shrink snap-center rounded-3xl overflow-hidden border border-white/10 transition-transform duration-500 hover:-translate-y-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  >
                     <img 
                       src={paper.imageUrl} 
                       alt={paper.title}
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                     <div className="absolute bottom-0 left-0 p-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1 block">{paper.category}</span>
                        <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{paper.title}</h3>
                     </div>
                  </Link>
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

        {/* NEW: INFINITE ART CANVASES - VISUAL SHOWCASE */}
        <section className="pb-32 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4 px-6">
                 Architect The <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500">Unimaginable</span>
              </h2>
              <p className="text-zinc-500 text-sm font-medium max-w-2xl mx-auto tracking-wide px-6">
                 The ultimate synthesis of synthetic computation and artistic intent. Access the universe's premier asset library.
              </p>
           </div>

           {/* Scrolling Track 1 (Moves Left) */}
           <div className="flex gap-6 w-fit animate-marquee-slow whitespace-nowrap mb-8 pl-4">
              {[
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80",
              ].map((img, i) => (
                <div key={i} className="w-72 h-96 rounded-3xl overflow-hidden border border-white/10 relative shrink-0 shadow-2xl inline-block grayscale hover:grayscale-0 transition-all duration-500 group cursor-pointer">
                   <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
                   <div className="absolute bottom-5 left-5 font-black text-white uppercase tracking-widest text-[10px]">
                      AI Generation Node_0{i+1}
                   </div>
                </div>
              )).concat( // Duplication for continuous loop
                [
                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80",
                ].map((img, i) => (
                  <div key={i+100} className="w-72 h-96 rounded-3xl overflow-hidden border border-white/10 relative shrink-0 shadow-2xl inline-block grayscale hover:grayscale-0 transition-all duration-500 group cursor-pointer">
                     <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
                     <div className="absolute bottom-5 left-5 font-black text-white uppercase tracking-widest text-[10px]">
                        AI Generation Node_0{i+1}
                     </div>
                  </div>
                ))
              )}
           </div>

           {/* Scrolling Track 2 (Moves Right - Replaced) */}
           <div className="flex gap-6 w-fit animate-marquee-reverse-slow whitespace-nowrap pl-4">
              {[
                "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=400&q=80",
              ].map((img, i) => (
                <div key={i} className="w-72 h-64 rounded-3xl overflow-hidden border border-white/10 relative shrink-0 shadow-2xl inline-block grayscale hover:grayscale-0 transition-all duration-500 group cursor-pointer">
                   <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-500" />
                </div>
              )).concat(
                [
                  "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=400&q=80",
                ].map((img, i) => (
                  <div key={i+200} className="w-72 h-64 rounded-3xl overflow-hidden border border-white/10 relative shrink-0 shadow-2xl inline-block grayscale hover:grayscale-0 transition-all duration-500 group cursor-pointer">
                     <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-500" />
                  </div>
                ))
              )}
           </div>
        </section>

      </main>
    </div>
  )
}
