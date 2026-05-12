import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, category, deviceType, imageUrl } = body

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Missing crucial dataset coordinates.' }, { status: 400 })
    }

    const wallpaper = await prisma.wallpaper.create({
      data: {
        title,
        category: category || 'General',
        deviceType: deviceType || 'desktop',
        imageUrl,
      },
    })

    return NextResponse.json(wallpaper, { status: 201 })
  } catch (error) {
    console.error('[API_WALLPAPER_POST]', error)
    return NextResponse.json({ error: 'Server grid connection severed.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const list = await prisma.wallpaper.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(list)
  } catch (error) {
    return NextResponse.json({ error: 'Failed listing asset nodes.' }, { status: 500 })
  }
}
