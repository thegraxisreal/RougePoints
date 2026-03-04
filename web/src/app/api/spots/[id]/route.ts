import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

// ─── GET /api/spots/[id] — public ───────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const spot = await db.spot.findUnique({
    where: { id },
    include: { _count: { select: { pins: true } } },
  });

  if (!spot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(spot);
}
