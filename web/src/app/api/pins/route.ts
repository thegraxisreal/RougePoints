import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

// ─── GET /api/pins?swLat=&swLng=&neLat=&neLng= ───────────────────────────────
// Public — returns visible pins inside a map bounding box.

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const swLat = parseFloat(searchParams.get("swLat") ?? "");
  const swLng = parseFloat(searchParams.get("swLng") ?? "");
  const neLat = parseFloat(searchParams.get("neLat") ?? "");
  const neLng = parseFloat(searchParams.get("neLng") ?? "");

  if ([swLat, swLng, neLat, neLng].some(isNaN)) {
    return NextResponse.json(
      { error: "swLat, swLng, neLat, neLng are required" },
      { status: 400 }
    );
  }

  const pins = await db.pin.findMany({
    where: {
      status: "visible",
      lat: { gte: swLat, lte: neLat },
      lng: { gte: swLng, lte: neLng },
    },
    select: {
      id: true,
      lat: true,
      lng: true,
      title: true,
      category: true,
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

// ─── POST /api/pins ───────────────────────────────────────────────────────────
// Requires auth.

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { lat, lng, title, body: pinBody, category } = body;

    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      typeof title !== "string" ||
      typeof pinBody !== "string" ||
      typeof category !== "string"
    ) {
      return NextResponse.json(
        { error: "lat, lng, title, body, category are required" },
        { status: 400 }
      );
    }

    const pin = await db.pin.create({
      data: {
        lat,
        lng,
        title: title.trim(),
        body: pinBody.trim(),
        category,
        authorId: user.id,
      },
      include: {
        author: { select: { handle: true, avatarUrl: true } },
      },
    });

    return NextResponse.json(pin, { status: 201 });
  } catch (err) {
    console.error("POST /api/pins error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
