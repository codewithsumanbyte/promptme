import { Flame } from "lucide-react"
import { PromptCard } from "@/components/cards/prompt-card"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function TrendingPage() {
  const prompts = await prisma.prompt.findMany({
    orderBy: { trendingScore: 'desc' },
    take: 50
  })

  const formattedPrompts = prompts.map(p => ({
    ...p,
    tags: p.tags ? p.tags.split(',') : []
  }))

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="bg-orange-500/10 p-4 rounded-full mb-4">
          <Flame className="h-8 w-8 text-orange-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Trending Prompts</h1>
        <p className="text-muted-foreground max-w-2xl">
          The hottest and most viral AI prompts right now. Based on views, copies, and saves.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {formattedPrompts.length > 0 ? formattedPrompts.map((prompt, index) => (
          <div key={prompt.id} className="relative">
            <div className="absolute -top-3 -left-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold shadow-lg">
              #{index + 1}
            </div>
            <PromptCard prompt={prompt} />
          </div>
        )) : (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            No trending prompts yet. Be the first to start a trend!
          </div>
        )}
      </div>
    </div>
  )
}
