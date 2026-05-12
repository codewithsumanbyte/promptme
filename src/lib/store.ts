import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface PromptItem {
  id: string
  title: string
  description: string
  promptText: string
  category: string
  aiTool: string
  tags: string[]
  thumbnail?: string | null
  referenceMedia?: string | null
  views: number
  copies: number
  saves: number
  trendingScore: number
}

interface PromptStore {
  savedPrompts: PromptItem[]
  savePrompt: (prompt: PromptItem) => void
  removePrompt: (id: string) => void
  isSaved: (id: string) => boolean
}

export const usePromptStore = create<PromptStore>()(
  persist(
    (set, get) => ({
      savedPrompts: [],
      savePrompt: (prompt) => set((state) => {
        if (state.savedPrompts.find((p) => p.id === prompt.id)) return state
        return { savedPrompts: [...state.savedPrompts, prompt] }
      }),
      removePrompt: (id) => set((state) => ({
        savedPrompts: state.savedPrompts.filter((p) => p.id !== id)
      })),
      isSaved: (id) => get().savedPrompts.some((p) => p.id === id),
    }),
    {
      name: 'wtfprompt-storage',
    }
  )
)
