import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// ─── GET /api/pins/[id]/comments — public ────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const { id: pinId } = await params;

  const pin = await db.pin.findUnique({ where: { id: pinId } });
  if (!pin || pin.status === "removed") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const comments = await db.comment.findMany({
    where: { pinId },
    select: {
      id: true,
      createdAt: true,
      text: true,
      authorId: true,
      author: { select: { handle: true, avatarUrl: true } },
    },
    orderBy: { createdAt: "asc" },
    take: 200,
  });

  return NextResponse.json(comments);
}

// ─── POST /api/pins/[id]/comments — requires auth ─────────────────────────────

export async function POST(req: NextRequest, { params }: Params) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: pinId } = await params;

  const pin = await db.pin.findUnique({ where: { id: pinId } });
  if (!pin || pin.status === "removed") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.text !== "string" || !body.text.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const text = body.text.trim().slice(0, 280);

  const comment = await db.comment.create({
    data: { pinId, authorId: user.id, text },
    select: {
      id: true,
      createdAt: true,
      text: true,
      authorId: true,
      author: { select: { handle: true, avatarUrl: true } },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
