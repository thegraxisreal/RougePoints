import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// ─── POST /api/media/[id]/complete ───────────────────────────────────────────

export async function POST(req: NextRequest, { params }: Params) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const media = await db.media.findUnique({
    where: { id },
    include: { pin: { select: { authorId: true } } },
  });

  if (!media) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }

  // Only the pin's author can complete the upload
  if (media.pin.authorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const width = typeof body.width === "number" ? body.width : null;
  const height = typeof body.height === "number" ? body.height : null;

  const updated = await db.media.update({
    where: { id },
    data: {
      state: "ready",
      ...(width !== null && { width }),
      ...(height !== null && { height }),
    },
  });

  return NextResponse.json(updated);
}
