import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// ─── GET /api/pins/[id] — public ─────────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const pin = await db.pin.findUnique({
    where: { id },
    include: {
      author: { select: { handle: true, avatarUrl: true } },
      media: {
        where: { state: "ready" },
        select: { id: true, s3Key: true, mimeType: true, width: true, height: true },
      },
    },
  });

  if (!pin || pin.status === "removed") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(pin);
}

// ─── DELETE /api/pins/[id] — requires auth, must be the author ───────────────

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const pin = await db.pin.findUnique({ where: { id } });

  if (!pin || pin.status === "removed") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (pin.authorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.pin.update({ where: { id }, data: { status: "removed" } });

  return new NextResponse(null, { status: 204 });
}
