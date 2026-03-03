import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

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

// ─── POST /api/pins/[id]/reactions ────────────────────────────────────────────
// Body: { kind: "fire" | "skull" | "heart" | "laugh" | "wow" }

export async function POST(req: NextRequest, { params }: Params) {
  let user;
  try {
    user = await requireUser();
  } catch (err) {
    return err as NextResponse;
  }

  const { id: pinId } = await params;
  const body = await req.json().catch(() => null);
  const kind: ReactionKind = body?.kind;

  if (!VALID_KINDS.includes(kind)) {
    return NextResponse.json(
      { error: "kind must be one of: fire, skull, heart, laugh, wow" },
      { status: 400 }
    );
  }

  const pin = await db.pin.findUnique({ where: { id: pinId } });
  if (!pin || pin.status === "removed") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = await db.reaction.findUnique({
    where: { userId_pinId_kind: { userId: user.id, pinId, kind } },
  });

  if (!existing) {
    const field = COUNT_FIELD[kind];
    await db.$transaction([
      db.reaction.create({ data: { userId: user.id, pinId, kind } }),
      db.pin.update({ where: { id: pinId }, data: { [field]: { increment: 1 } } }),
    ]);
  }

  return NextResponse.json({ ok: true });
}

// ─── DELETE /api/pins/[id]/reactions?kind=fire ────────────────────────────────

export async function DELETE(req: NextRequest, { params }: Params) {
  let user;
  try {
    user = await requireUser();
  } catch (err) {
    return err as NextResponse;
  }

  const { id: pinId } = await params;
  const kind = req.nextUrl.searchParams.get("kind") as ReactionKind | null;

  if (!kind || !VALID_KINDS.includes(kind)) {
    return NextResponse.json({ error: "kind query param required" }, { status: 400 });
  }

  const existing = await db.reaction.findUnique({
    where: { userId_pinId_kind: { userId: user.id, pinId, kind } },
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
