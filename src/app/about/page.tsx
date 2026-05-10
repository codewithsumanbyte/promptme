import { Shield, Heart, Sparkles, Globe, Mail } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="container mx-auto px-6 pt-24 max-w-4xl">
        
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-zinc-300 mb-8">
             <Sparkles className="w-4 h-4" /> About PromptMe
          </div>
          <h1 className="text-6xl font-extrabold tracking-tighter mb-8">Next-Gen Hub for AI Prompts.</h1>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed">
            PromptMe is a modern platform dedicated to surfacing the best, most effective, and viral AI prompts that enable users to create faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-zinc-900/50 border border-white/10 p-10 rounded-3xl">
             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black mb-6">
               <Shield className="w-6 h-6" />
             </div>
             <h3 className="text-2xl font-bold mb-4">Curated High Quality</h3>
             <p className="text-zinc-400 leading-relaxed">We manually review and test popular prompts daily to ensure only highly performant outputs land on our feed.</p>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 p-10 rounded-3xl">
             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black mb-6">
               <Heart className="w-6 h-6" />
             </div>
             <h3 className="text-2xl font-bold mb-4">Built For Creators</h3>
             <p className="text-zinc-400 leading-relaxed">Designed with maximum workflows in mind. Simple copy-paste, rich visual previews, and category tagging.</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row items-center justify-between">
           <p className="text-zinc-500 text-sm">© 2026 PromptMe Platform Inc.</p>
           <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
           </div>
        </div>

      </div>
    </div>
  )
}
