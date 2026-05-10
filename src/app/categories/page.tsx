import { ArrowRight, Search, MessageSquare, Image, Video, Code, Briefcase, Target, Play, Zap, BarChart3, Grid } from "lucide-react"
import Link from "next/link"

const CATEGORIES = [
  { name: "Image", icon: <Image className="w-8 h-8 text-white/80" />, count: "Prompts" },
  { name: "Video", icon: <Video className="w-8 h-8 text-white/80" />, count: "Prompts" },
  { name: "ChatGPT", icon: <MessageSquare className="w-8 h-8 text-white/80" />, count: "Prompts" },
  { name: "Coding", icon: <Code className="w-8 h-8 text-white/80" />, count: "Prompts" },
  { name: "Career", icon: <Briefcase className="w-8 h-8 text-white/80" />, count: "Prompts" },
  { name: "Marketing", icon: <Target className="w-8 h-8 text-white/80" />, count: "Prompts" },
  { name: "YouTube", icon: <Play className="w-8 h-8 text-white/80" />, count: "Prompts" },
  { name: "Productivity", icon: <Zap className="w-8 h-8 text-white/80" />, count: "Prompts" },
  { name: "Business", icon: <BarChart3 className="w-8 h-8 text-white/80" />, count: "Prompts" },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="container mx-auto px-6 pt-24">
        <div className="max-w-2xl mb-16">
          <h1 className="text-5xl font-extrabold tracking-tighter mb-6">Categories</h1>
          <p className="text-zinc-400 text-lg">Browse the ultimate library of AI prompts across multiple niches and AI engines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category, idx) => (
            <Link 
              href={`/explore?category=${category.name.toLowerCase()}`} 
              key={idx}
              className="group block bg-black border border-white/10 rounded-3xl p-8 hover:bg-white/[0.02] hover:border-white/30 transition-all relative overflow-hidden"
            >
              <div className="flex items-start justify-between relative z-10">
                 <div className="p-4 rounded-2xl bg-white/[0.03] group-hover:bg-white/[0.08] transition-colors inline-flex">
                   {category.icon}
                 </div>
                 <div className="bg-white/[0.05] p-2 rounded-full group-hover:bg-white transition-all text-white group-hover:text-black">
                   <ArrowRight className="w-4 h-4" />
                 </div>
              </div>
              
              <div className="mt-12 relative z-10">
                 <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                 <p className="text-zinc-500 text-sm font-medium">Explore collections</p>
              </div>

              <div className="absolute -right-12 -bottom-12 opacity-5 group-hover:opacity-[0.08] transition-opacity">
                 <div className="scale-[3.5]">
                   {category.icon}
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
