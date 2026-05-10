import { notFound } from "next/navigation"
import { Copy, Eye, Bookmark, Share2 } from "lucide-react"
import prisma from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function PromptDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const promptId = resolvedParams.id
  
  const prompt = await prisma.prompt.findUnique({
    where: { id: promptId }
  })

  if (!prompt) {
    notFound()
  }

  const tags = prompt.tags ? prompt.tags.split(',') : []

  // Fire and forget view increment
  fetch(`http://localhost:3000/api/prompts/${promptId}/view`, { method: 'POST' }).catch(() => {})

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="glass-dark rounded-2xl p-6 md:p-10 border border-border/50">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
          <div>
            <Badge variant="secondary" className="mb-4 bg-primary/20 text-primary border-primary/20">
              {prompt.category} • {prompt.aiTool}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {prompt.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {prompt.description}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {prompt.referenceMedia && (
          <div className="mb-8 rounded-xl overflow-hidden border border-border/50 bg-black/50 aspect-video relative">
            {prompt.referenceMedia.endsWith('.mp4') ? (
              <video src={prompt.referenceMedia} controls className="w-full h-full object-contain" />
            ) : (
              <img src={prompt.referenceMedia} alt="Reference" className="w-full h-full object-cover" />
            )}
          </div>
        )}

        <div className="bg-background/50 border border-border/50 rounded-xl p-6 relative group">
          <h3 className="font-semibold mb-4 flex items-center text-primary">
            Prompt
          </h3>
          <p className="font-mono text-sm md:text-base leading-relaxed text-foreground/90 whitespace-pre-wrap selection:bg-primary/30">
            {prompt.promptText}
          </p>
          <Button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Copy className="h-4 w-4 mr-2" /> Copy
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-muted-foreground bg-background/50">
              #{tag.trim()}
            </Badge>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between text-sm text-muted-foreground border-t border-border/50 pt-6">
          <div className="flex space-x-4">
            <span className="flex items-center">
              <Eye className="mr-1.5 h-4 w-4" /> {prompt.views} Views
            </span>
            <span className="flex items-center">
              <Copy className="mr-1.5 h-4 w-4" /> {prompt.copies} Copies
            </span>
          </div>
          <div>
            Added {new Date(prompt.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  )
}
