import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

const VALID_KINDS = ["fire", "skull", "heart", "laugh", "wow"] as const;
type ReactionKind = (typeof VALID_KINDS)[number];

const COUNT_FIELD: Record<ReactionKind, string> = {
  fire: "fireCount",
  skull: "skullCount",
  heart: "heartCount",
  laugh: "laughCount",
  wow: "wowCount",
};

// Stub until auth is wired up
const STUB_USER_ID = "stub";

// ─── POST /api/pins/[id]/reactions ────────────────────────────────────────────
// Body: { kind: "fire" | "skull" | "heart" | "laugh" | "wow" }
// Adds a reaction; if the user already reacted with this kind, it's a no-op.

export async function POST(req: NextRequest, { params }: Params) {
  const { id: pinId } = await params;
  const body = await req.json().catch(() => null);
  const kind: ReactionKind = body?.kind;

  if (!VALID_KINDS.includes(kind)) {
    return NextResponse.json({ error: "kind must be one of: fire, skull, heart, laugh, wow" }, { status: 400 });
  }

  const pin = await db.pin.findUnique({ where: { id: pinId } });
  if (!pin || pin.status === "removed") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const field = COUNT_FIELD[kind];

  // createMany with skipDuplicates would be cleaner but SQLite adapter doesn't support it.
  // Use upsert-style: try create, ignore unique conflict.
  const existing = await db.reaction.findUnique({
    where: { userId_pinId_kind: { userId: STUB_USER_ID, pinId, kind } },
  });

  if (!existing) {
    await db.$transaction([
      db.reaction.create({ data: { userId: STUB_USER_ID, pinId, kind } }),
      db.pin.update({ where: { id: pinId }, data: { [field]: { increment: 1 } } }),
    ]);
  }

  return NextResponse.json({ ok: true });
}

// ─── DELETE /api/pins/[id]/reactions?kind=fire ────────────────────────────────

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id: pinId } = await params;
  const kind = req.nextUrl.searchParams.get("kind") as ReactionKind | null;

  if (!kind || !VALID_KINDS.includes(kind)) {
    return NextResponse.json({ error: "kind query param required" }, { status: 400 });
  }

  const existing = await db.reaction.findUnique({
    where: { userId_pinId_kind: { userId: STUB_USER_ID, pinId, kind } },
  });

  if (existing) {
    const field = COUNT_FIELD[kind];
    await db.$transaction([
      db.reaction.delete({ where: { id: existing.id } }),
      db.pin.update({ where: { id: pinId }, data: { [field]: { decrement: 1 } } }),
    ]);
  }

  return new NextResponse(null, { status: 204 });
}
