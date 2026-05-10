"use client"

import { usePromptStore } from "@/lib/store"
import { PromptCard } from "@/components/cards/prompt-card"
import { Bookmark, Search } from "lucide-react"
import Link from "next/link"

export default function SavedPage() {
  const savedPrompts = usePromptStore((state) => state.savedPrompts)

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Bookmark className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Saved Prompts</h1>
        <p className="text-muted-foreground max-w-2xl">
          Your personal collection of viral AI prompts. Saved locally on your device.
        </p>
      </div>

      {savedPrompts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-card/20 rounded-xl border border-border/50 backdrop-blur-sm">
          <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No saved prompts yet</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Start exploring the feed and save prompts you want to keep for later by clicking the bookmark icon.
          </p>
          <Link href="/explore">
             <button className="bg-white text-black font-extrabold px-8 py-3 rounded-full hover:bg-zinc-200 transition-all">
                Explore Database
             </button>
          </Link>
        </div>
      )}
    </div>
  )
}
