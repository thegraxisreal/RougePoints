import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_CODE = "1612";

// ─── GET /api/spots?swLat=&swLng=&neLat=&neLng= ────────────────────────────
// Public — returns spots inside a map bounding box.

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

  const spots = await db.spot.findMany({
    where: {
      lat: { gte: swLat, lte: neLat },
      lng: { gte: swLng, lte: neLng },
    },
    select: {
      id: true,
      name: true,
      lat: true,
      lng: true,
      type: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json(spots);
}

// ─── POST /api/spots — admin only ───────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.adminCode !== ADMIN_CODE) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, lat, lng, type } = body;
  if (
    typeof name !== "string" ||
    typeof lat !== "number" ||
    typeof lng !== "number"
  ) {
    return NextResponse.json(
      { error: "name, lat, lng are required" },
      { status: 400 }
    );
  }

  const spot = await db.spot.create({
    data: {
      name: name.trim(),
      lat,
      lng,
      type: typeof type === "string" ? type : "school",
    },
  });

  return NextResponse.json(spot, { status: 201 });
}
