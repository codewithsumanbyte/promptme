import { Suspense } from "react"
import { Metadata } from "next"
import { PromptBuilder } from "@/components/lab/PromptBuilder"
import { ParticleBackground } from "@/components/3d/particle-background"
import { FlaskConical, Loader2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Prompt Lab - WTFprompt",
  description: "Visually synthesize and engineer hyper-performing AI prompts in real-time.",
}

export default function LabPage() {
  return (
    <main className="min-h-screen bg-black pt-20 md:pt-28 pb-20 relative overflow-hidden">
      {/* The existing Particle Background gives that premium tech atmosphere */}
      <ParticleBackground />
      
      {/* Ambient Radial Glows contained securely to prevent layout spill */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[-10%] w-64 md:w-96 h-64 md:h-96 bg-blue-900/20 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-64 md:w-96 h-64 md:h-96 bg-indigo-900/20 rounded-full blur-[80px] md:blur-[120px]" />
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 relative z-10 overflow-x-hidden">
        
        {/* Header Identity */}
        <header className="text-center mb-8 md:mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/10 px-3 py-1 rounded-full mb-4 md:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase text-zinc-400">Experimental Environment</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white mb-4">
            Prompt <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-800">Lab</span>
          </h1>
          
          <p className="text-zinc-500 text-sm md:text-lg font-medium max-w-2xl mx-auto px-2">
            Synthesize state-of-the-art engineering. Chain visual modifiers to construct high-conversion instructions for generative systems.
          </p>
        </header>

        {/* Dynamic Workspace */}
        <div className="animate-in fade-in duration-1000 delay-200 fill-mode-both">
          <Suspense fallback={
            <div className="w-full h-64 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-zinc-600 animate-spin" />
            </div>
          }>
            <PromptBuilder />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
