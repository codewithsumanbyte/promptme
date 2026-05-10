import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const { action, value } = await request.json();

    let updateData = {};
    
    if (action === 'toggleFeatured') {
      updateData = { featured: value };
    } else if (action === 'toggleTrending') {
      // If trending toggle is ON, force a high trending score, else reset.
      updateData = { trendingScore: value ? 9999 : 0 };
    }

    const prompt = await prisma.prompt.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(prompt);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
