import { Search } from "lucide-react"
import { PromptCard } from "@/components/cards/prompt-card"
import { Input } from "@/components/ui/input"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const resolvedParams = await searchParams
  const q = resolvedParams.q || ""
  const category = resolvedParams.category || ""

  const where: Prisma.PromptWhereInput = {}

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { promptText: { contains: q } },
      { category: { contains: q } },
    ]
  }

  if (category && category !== "All") {
    // Match partial since data could be 'Image' or 'Image Generation'
    where.category = { contains: category }
  }

  const prompts = await prisma.prompt.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  })

  const formattedPrompts = prompts.map(p => ({
    ...p,
    tags: p.tags ? p.tags.split(',') : []
  }))

  const categories = [
    "All",
    "Image",
    "Video",
    "Chat",
    "Coding",
    "Career",
    "Art",
    "Copywriting"
  ]

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Hero Title */}
      <div className="relative border-b border-white/5 bg-zinc-950/30">
        <div className="container max-w-7xl mx-auto px-4 py-16 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">Universe</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-xl font-medium">
            Instantly harness industry-leading intelligence. Search across categories to retrieve high-performance prompt libraries.
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12">

        {/* SEARCH & FILTER CONTROLS */}
        <div className="flex flex-col gap-8 mb-12">

          {/* Dynamic Search Console */}
          <div className="relative group max-w-2xl mx-auto w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-20 group-hover:opacity-60 transition-opacity" />
            <div className="relative flex items-center bg-zinc-950 border border-white/10 rounded-2xl focus-within:border-white/30 transition-all px-4">
              <Search className="h-5 w-5 text-zinc-500" />
              <form action="/explore" className="w-full">
                <input
                  type="hidden"
                  name="category"
                  value={category}
                />
                <Input
                  name="q"
                  defaultValue={q}
                  autoComplete="off"
                  placeholder="Search engine capabilities, strings, or subjects..."
                  className="border-0 bg-transparent h-14 focus-visible:ring-0 text-white placeholder:text-zinc-600 text-base pl-3 w-full"
                />
              </form>
            </div>
          </div>

          {/* Segmented Control Bar */}
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
            {categories.map(cat => {
              const isAll = cat === "All"
              const isSelected = (isAll && !category) || category.toLowerCase() === cat.toLowerCase()

              // Generate link ensuring current search query persists
              const queryParams = new URLSearchParams()
              if (q) queryParams.set("q", q)
              if (!isAll) queryParams.set("category", cat)

              const href = `/explore${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

              return (
                <Link
                  key={cat}
                  href={href}
                  className={`px-5 py-2.5 rounded-full border text-xs md:text-sm font-bold tracking-wide transition-all duration-300 whitespace-nowrap ${isSelected
                      ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105"
                      : "bg-zinc-950 border-white/10 text-zinc-400 hover:text-white hover:border-white/30"
                    }`}
                >
                  {cat}
                </Link>
              )
            })}
          </div>
        </div>

        {/* RESULTS GRID */}
        {formattedPrompts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {formattedPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/5 rounded-3xl bg-zinc-950/20">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Search className="h-6 w-6 text-zinc-700" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Prompts Located</h3>
            <p className="text-zinc-500 text-sm max-w-xs">We couldn't find any prompt artifacts correlating to "{q || category}". Try generalized terminology.</p>
            {(q || category) && (
              <Link href="/explore" className="mt-6 text-xs font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
                Reset Filters
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
