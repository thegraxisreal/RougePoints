import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

// ─── GET /api/pins/new-reactions?since=ISO_DATE ──────────────────────────────
// Returns pins belonging to the current user that received new reactions
// after the given timestamp.

export async function GET(req: NextRequest) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = req.nextUrl.searchParams.get("since");
  const sinceDate = since ? new Date(since) : new Date(0);

  // Find reactions on the user's pins that were created after `since`
  const reactions = await db.reaction.findMany({
    where: {
      pin: { authorId: user.id, status: "visible" },
      createdAt: { gt: sinceDate },
      // Exclude the user's own reactions on their own pins
      userId: { not: user.id },
    },
    select: {
      kind: true,
      pin: {
        select: { id: true, title: true },
      },
    },
  });

  // Group by pin
  const pinMap = new Map<
    string,
    { pinId: string; pinTitle: string; kinds: Record<string, number> }
  >();

  for (const r of reactions) {
    const existing = pinMap.get(r.pin.id);
    if (existing) {
      existing.kinds[r.kind] = (existing.kinds[r.kind] || 0) + 1;
    } else {
      pinMap.set(r.pin.id, {
        pinId: r.pin.id,
        pinTitle: r.pin.title,
        kinds: { [r.kind]: 1 },
      });
    }
  }

  // Transform to response format
  const result = Array.from(pinMap.values()).map((entry) => ({
    pinId: entry.pinId,
    pinTitle: entry.pinTitle,
    reactions: Object.entries(entry.kinds).map(([kind, count]) => ({
      kind,
      count,
    })),
    totalNew: Object.values(entry.kinds).reduce((a, b) => a + b, 0),
  }));

  return NextResponse.json(result);
}
