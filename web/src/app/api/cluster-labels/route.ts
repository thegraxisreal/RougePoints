import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_CODE = process.env.ADMIN_CODE ?? "1612";

// ─── GET /api/cluster-labels?swLat=&swLng=&neLat=&neLng= ────────────────────
// Public — returns cluster labels inside a bounding box.

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const swLat = parseFloat(searchParams.get("swLat") ?? "");
  const swLng = parseFloat(searchParams.get("swLng") ?? "");
  const neLat = parseFloat(searchParams.get("neLat") ?? "");
  const neLng = parseFloat(searchParams.get("neLng") ?? "");

  if ([swLat, swLng, neLat, neLng].some(isNaN)) {
    return NextResponse.json(
      { error: "swLat, swLng, neLat, neLng are required" },
      { status: 400 },
    );
  }

  const labels = await db.clusterLabel.findMany({
    where: {
      lat: { gte: swLat, lte: neLat },
      lng: { gte: swLng, lte: neLng },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json(labels);
}

// ─── POST /api/cluster-labels — admin only, create a label ──────────────────

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.adminCode !== ADMIN_CODE) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lat, lng, name } = body;
  if (typeof lat !== "number" || typeof lng !== "number") {
    return NextResponse.json(
      { error: "lat, lng are required" },
      { status: 400 },
    );
  }

  const label = await db.clusterLabel.create({
    data: {
      lat,
      lng,
      name: typeof name === "string" ? name.trim() : "Town",
    },
  });

  return NextResponse.json(label, { status: 201 });
}

// ─── PATCH /api/cluster-labels — admin only, rename a label ─────────────────

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.adminCode !== ADMIN_CODE) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, name } = body;
  if (typeof id !== "string" || typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "id and name are required" },
      { status: 400 },
    );
  }

  const label = await db.clusterLabel.update({
    where: { id },
    data: { name: name.trim() },
  });

  return NextResponse.json(label);
}
