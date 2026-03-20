import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // SQLite doesn't always handle cascade cleanly without PRAGMA foreign_keys = ON, so we manually delete relations.
    await prisma.$transaction([
      prisma.transcriptSegment.deleteMany({ where: { transcriptId: id } }),
      prisma.actionItem.deleteMany({ where: { transcriptId: id } }),
      prisma.decision.deleteMany({ where: { transcriptId: id } }),
      prisma.transcript.delete({ where: { id } })
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
