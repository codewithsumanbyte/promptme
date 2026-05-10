import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string, action: string }> }
) {
  const resolvedParams = await params
  const { id, action } = resolvedParams

  try {
    if (action === 'view') {
      await prisma.prompt.update({
        where: { id },
        data: { 
          views: { increment: 1 },
          trendingScore: { increment: 1 } // view = 1 point
        }
      })
    } else if (action === 'copy') {
      await prisma.prompt.update({
        where: { id },
        data: { 
          copies: { increment: 1 },
          trendingScore: { increment: 3 } // copy = 3 points
        }
      })
    } else if (action === 'save') {
      await prisma.prompt.update({
        where: { id },
        data: { 
          saves: { increment: 1 },
          trendingScore: { increment: 2 } // save = 2 points
        }
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 })
  }
}
