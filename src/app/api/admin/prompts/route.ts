import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const prompt = await prisma.prompt.create({
      data: {
        title: body.title,
        description: body.description,
        promptText: body.promptText,
        category: body.category,
        aiTool: body.aiTool,
        tags: body.tags || '',
        referenceMedia: body.referenceMedia || null,
        featured: false,
        trendingScore: 0,
        views: 0,
        copies: 0,
        saves: 0
      }
    })

    return NextResponse.json({ success: true, prompt })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create prompt' }, { status: 500 })
  }
}
