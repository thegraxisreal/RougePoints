import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

// ─── GET /api/pins/[id] ───────────────────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const pin = await db.pin.findUnique({
    where: { id },
    include: {
      author: { select: { handle: true, avatarUrl: true } },
      media: { select: { id: true, s3Key: true, mimeType: true, width: true, height: true } },
    },
  });

  if (!pin || pin.status === "removed") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(pin);
}

// ─── DELETE /api/pins/[id] ────────────────────────────────────────────────────
// Soft-deletes by setting status = "removed".
// TODO: verify req.user.id === pin.authorId once auth is wired up.

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const pin = await db.pin.findUnique({ where: { id } });
  if (!pin || pin.status === "removed") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.pin.update({ where: { id }, data: { status: "removed" } });

  return new NextResponse(null, { status: 204 });
}
