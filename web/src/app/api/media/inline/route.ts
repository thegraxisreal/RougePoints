import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

// ─── POST /api/media/inline ───────────────────────────────────────────────────
// Auth-gated. Accepts a base64 data URL and stores it directly in the DB.
// Used when S3 is not configured.

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

    const { pinId, dataUrl } = body;

    if (!pinId || typeof pinId !== "string") {
      return NextResponse.json({ error: "pinId is required" }, { status: 400 });
    }

    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
      return NextResponse.json({ error: "dataUrl must be a valid image data URL" }, { status: 400 });
    }

    // ~4MB base64 limit (resized images should be well under this)
    if (dataUrl.length > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "Image too large (max 3 MB)" }, { status: 400 });
    }

    const pin = await db.pin.findUnique({ where: { id: pinId } });
    if (!pin) {
      return NextResponse.json({ error: "Pin not found" }, { status: 404 });
    }
    if (pin.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const media = await db.media.create({
      data: {
        pinId,
        s3Key: dataUrl, // store the data URL in the s3Key field
        mimeType: "image/jpeg",
        state: "ready",
      },
    });

    return NextResponse.json({ mediaId: media.id, url: dataUrl }, { status: 201 });
  } catch (err) {
    console.error("POST /api/media/inline error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
