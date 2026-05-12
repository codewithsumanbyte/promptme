import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wtfprompt.vercel.app'

  // 1. Defined Static Top Routes
  const routes = [
    '',
    '/explore',
    '/wallpapers',
    '/lab',
    '/about',
    '/trending'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  try {
    // 2. Fetch dynamic prompt details to give specific direct links to Google
    const prompts = await prisma.prompt.findMany({
      select: { id: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit to latest 100 for map weight
    })

    const promptUrls = prompts.map((p) => ({
      url: `${baseUrl}/prompt/${p.id}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...routes, ...promptUrls]
  } catch (error) {
    // Fallback to static only if DB call glitches during static builds
    return routes
  }
}
