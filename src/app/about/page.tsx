import { Shield, Heart, Sparkles, Globe, Mail, Zap, Code, Star } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white pb-24 overflow-hidden relative">
      
      {/* Cinematic Backdrops */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-violet-900/20 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      <div className="container mx-auto px-6 pt-32 relative z-10">
        
        {/* HERO INTRO */}
        <div className="text-center mb-24 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/10 px-4 py-1.5 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">System Intelligence v2.4</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] max-w-4xl bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Rewriting The Fabric of <span className="text-white">AI Interactivity.</span>
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium px-4">
            WTFprompt isn't just a repository. It's a high-fidelity ecosystem engineered for precision prompting and generative excellence.
          </p>
        </div>

        {/* MISSION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {[
            {
              icon: <Zap className="w-6 h-6" />,
              title: "High-Velocity Inputs",
              desc: "Optimized prompt structures mapped for instant context-window ingestion and ultimate compute efficiency."
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: "Secured Precision",
              desc: "Every operational token and command in our feed passes hard logical triage before deployment."
            },
            {
              icon: <Star className="w-6 h-6" />,
              title: "Elite Visualizations",
              desc: "A dedicated hub integrating premium high-res visuals and multi-device compatibility layouts."
            }
          ].map((feat, i) => (
            <div key={i} className="group relative bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 overflow-hidden">
               <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/[0.02] rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
               <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-500">
                  {feat.icon}
               </div>
               <h3 className="text-xl font-bold mb-4 text-white tracking-tight">{feat.title}</h3>
               <p className="text-zinc-500 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* THE AUTHOR SIGNATURE - MINIMALIST EDITION */}
        <div className="max-w-2xl mx-auto relative mb-32 text-center">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl opacity-50 -z-10" />
           
           <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full mb-6 mx-auto">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400">System Architect</span>
           </div>
           
           <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
              Made with ❤️ by <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400 drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">Suman Banerjee</span>
           </h2>
        </div>

        {/* STATS FOOTER STRIP */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto px-4 text-center md:text-left">
           <div>
              <div className="text-xl font-black tracking-tighter text-white mb-1 flex items-center gap-1.5 justify-center md:justify-start">
                 WTF<span className="text-zinc-600">prompt</span>
              </div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">© 2026 Core Node Network. All Matrix Active.</p>
           </div>
           
           <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
             {[
               { n: "250K+", l: "Deployments" },
               { n: "50K+", l: "Operatives" },
               { n: "12MS", l: "Latency avg" }
             ].map((s, i) => (
               <div key={i} className="flex flex-col">
                  <span className="text-white font-black text-lg tracking-tight">{s.n}</span>
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">{s.l}</span>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  )
}
