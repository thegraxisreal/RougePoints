import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

const ADMIN_CODE = process.env.ADMIN_CODE ?? "1612";

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

// ─── DELETE /api/spots/[id] — admin only ────────────────────────────────────

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;

  const body = await req.json().catch(() => null);
  if (!body || body.adminCode !== ADMIN_CODE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const spot = await db.spot.findUnique({ where: { id } });
  if (!spot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.spot.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
