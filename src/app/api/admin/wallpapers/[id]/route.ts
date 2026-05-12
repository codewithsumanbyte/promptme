import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    
    // 1. Locate record to harvest current Cloud URL
    const record = await prisma.wallpaper.findUnique({
      where: { id }
    })

    if (!record) {
      return NextResponse.json({ error: 'Resource signature missing.' }, { status: 404 })
    }

    // 2. Trigger async Cloud Disposal (Decoupled to ensure non-blocking destruction)
    if (record.imageUrl) {
      try {
        const pathParts = record.imageUrl.split('/public/wallpapers/')
        if (pathParts.length > 1) {
          // Decode URL string back to physical filesystem key
          const cloudPath = decodeURIComponent(pathParts[1])
          
          await supabase.storage
            .from('wallpapers')
            .remove([cloudPath])
        }
      } catch (storageError) {
        // Log explicitly, but allow the pipeline to proceed to database cleansing
        console.warn("[STORAGE_DELETE_WARNING]", storageError)
      }
    }

    // 3. Cleanse metadata sync record from core database (Critical Step)
    await prisma.wallpaper.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[WALLPAPER_DELETE]", error)
    return NextResponse.json({ 
      error: 'Target annihilation failed.', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    
    const check = await prisma.wallpaper.findUnique({ where: { id } })
    if (!check) {
      return NextResponse.json({ error: 'Logic configuration target missing.' }, { status: 404 })
    }
    
    const body = await request.json()
    
    const updated = await prisma.wallpaper.update({
      where: { id },
      data: body
    })
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error("[WALLPAPER_PATCH]", error)
    return NextResponse.json({ 
      error: 'Logic reconfiguration failed.',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
