import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMediaUrl } from "@/lib/media";

// ─── GET /api/pins/random?limit=20 ───────────────────────────────────────────
// Public — returns random visible pins for the feed.

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

  if (isNaN(limit) || limit < 1) {
    return NextResponse.json({ error: "limit must be a positive integer" }, { status: 400 });
  }

  // Count total visible standalone pins
  const total = await db.pin.count({
    where: { status: "visible", spotId: null },
  });

  if (total === 0) {
    return NextResponse.json([]);
  }

  // Pick random offset — fetch a batch then shuffle to approximate randomness
  const fetchLimit = Math.min(limit * 4, total);
  const skip = total > fetchLimit ? Math.floor(Math.random() * (total - fetchLimit)) : 0;

  const pins = await db.pin.findMany({
    where: { status: "visible", spotId: null },
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
      authorId: true,
      author: { select: { handle: true, avatarUrl: true } },
      media: {
        where: { state: "ready" },
        select: { id: true, s3Key: true, state: true },
      },
    },
    skip,
    take: fetchLimit,
    orderBy: { createdAt: "desc" },
  });

  // Shuffle and return requested limit
  const shuffled = pins.sort(() => Math.random() - 0.5).slice(0, limit);

  const pinsWithUrls = shuffled.map((pin: (typeof pins)[number]) => ({
    ...pin,
    media: pin.media.map((m: (typeof pin.media)[number]) => ({ ...m, url: getMediaUrl(m.s3Key) })),
  }));

  return NextResponse.json(pinsWithUrls);
}
