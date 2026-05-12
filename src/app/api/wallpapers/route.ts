import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const device = searchParams.get('device') // desktop | mobile | tablet

    let whereClause = {}
    if (device && device !== 'all') {
      whereClause = { deviceType: device }
    }

    const collection = await prisma.wallpaper.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(collection)
  } catch (error) {
    console.error("[WALLPAPERS_PUBLIC_GET]", error)
    return NextResponse.json({ error: "Sub-grid failure." }, { status: 500 })
  }
}
