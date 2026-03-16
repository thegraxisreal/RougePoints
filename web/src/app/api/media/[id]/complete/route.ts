import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// ─── POST /api/media/[id]/complete ────────────────────────────────────────────
// Auth-gated — only the pin's author can call this.
// Sets Media state to "ready" and saves optional dimensions.

export async function POST(req: NextRequest, { params }: Params) {
  try {
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

    if (media.pin.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { width, height } = body ?? {};

    const updated = await db.media.update({
      where: { id },
      data: {
        state: "ready",
        ...(typeof width === "number" ? { width } : {}),
        ...(typeof height === "number" ? { height } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("POST /api/media/[id]/complete error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
