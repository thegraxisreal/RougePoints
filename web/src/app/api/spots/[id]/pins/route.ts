import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// ─── GET /api/spots/[id]/pins — public ──────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const spot = await db.spot.findUnique({ where: { id } });
  if (!spot) {
    return NextResponse.json({ error: "Spot not found" }, { status: 404 });
  }

  const pins = await db.pin.findMany({
    where: { spotId: id, status: "visible" },
    select: {
      id: true,
      lat: true,
      lng: true,
      title: true,
      category: true,
      authorId: true,
      fireCount: true,
      skullCount: true,
      heartCount: true,
      laughCount: true,
      wowCount: true,
      createdAt: true,
      author: { select: { handle: true, avatarUrl: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return NextResponse.json(pins);
}

// ─── POST /api/spots/[id]/pins — auth required ─────────────────────────────

export async function POST(req: NextRequest, { params }: Params) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const spot = await db.spot.findUnique({ where: { id } });
  if (!spot) {
    return NextResponse.json({ error: "Spot not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, category } = body;
  if (
    typeof title !== "string" ||
    typeof category !== "string"
  ) {
    return NextResponse.json(
      { error: "title, category are required" },
      { status: 400 }
    );
  }

  const pin = await db.pin.create({
    data: {
      lat: spot.lat,
      lng: spot.lng,
      title: title.trim(),
      category,
      authorId: user.id,
      spotId: id,
    },
    include: {
      author: { select: { handle: true, avatarUrl: true } },
    },
  });

  return NextResponse.json(pin, { status: 201 });
}
