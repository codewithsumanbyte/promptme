import { Suspense } from "react"
import { Search } from "lucide-react"
import { PromptCard } from "@/components/cards/prompt-card"
import { Input } from "@/components/ui/input"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

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
      { promptText: { contains: q } }
    ]
  }

  if (category) {
    where.category = category
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
    "Image Generation",
    "Video Generation",
    "ChatGPT",
    "Coding",
    "Career",
    "Marketing",
    "Productivity"
  ]

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Explore Prompts</h1>
        <p className="text-muted-foreground max-w-2xl">
          Search our database of viral AI prompts. Filter by category or search by keywords to find exactly what you need.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <form action="/explore">
            <Input 
              name="q"
              defaultValue={q}
              placeholder="Search prompts, tools, or keywords..." 
              className="pl-10 h-12 bg-card/50 backdrop-blur-sm border-border/50 text-base"
            />
          </form>
        </div>

        {/* Categories (Simple horizontal scroll on mobile, wrap on desktop) */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 md:pb-0 md:flex-wrap">
          {categories.map(cat => {
            const isSelected = (cat === "All" && !category) || category === cat
            return (
              <a 
                key={cat} 
                href={`/explore${cat === "All" ? "" : `?category=${encodeURIComponent(cat)}`}`}
                className={`shrink-0 px-4 py-2 rounded-full border transition-colors text-sm font-medium ${
                  isSelected 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-card/50 border-border/50 text-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </a>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {formattedPrompts.length > 0 ? formattedPrompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        )) : (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            No prompts found matching your criteria. Try a different search.
          </div>
        )}
      </div>
    </div>
  )
}
