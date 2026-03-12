import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function getS3Client() {
  return new S3Client({
    region: process.env.S3_REGION ?? "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
    ...(process.env.S3_ENDPOINT
      ? { endpoint: process.env.S3_ENDPOINT, forcePathStyle: true }
      : {}),
  });
}

// ─── POST /api/media/presign ──────────────────────────────────────────────────
// Auth-gated. Creates a Media record and returns a presigned S3 PUT URL.

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

    const { pinId, mimeType, filename: _filename } = body;

    if (!pinId || typeof pinId !== "string") {
      return NextResponse.json({ error: "pinId is required" }, { status: 400 });
    }

    if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: "mimeType must be one of: image/jpeg, image/png, image/webp, image/gif" },
        { status: 400 }
      );
    }

    // Verify pin exists and belongs to this user
    const pin = await db.pin.findUnique({ where: { id: pinId } });
    if (!pin) {
      return NextResponse.json({ error: "Pin not found" }, { status: 404 });
    }
    if (pin.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bucket = process.env.S3_BUCKET;
    if (!bucket) {
      return NextResponse.json({ error: "S3 not configured" }, { status: 500 });
    }

    // Create Media record with state "pending" to get the ID
    const media = await db.media.create({
      data: {
        pinId,
        s3Key: "", // placeholder, updated below
        mimeType,
        state: "pending",
      },
    });

    const ext = MIME_TO_EXT[mimeType] ?? "bin";
    const s3Key = `pins/${pinId}/${media.id}.${ext}`;

    // Update with actual s3Key
    await db.media.update({
      where: { id: media.id },
      data: { s3Key },
    });

    const client = getS3Client();
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: s3Key,
      ContentType: mimeType,
      // Enforce max 8 MB via S3 policy on the bucket; the presigned URL itself
      // doesn't enforce content-length for PUT, but the bucket policy can.
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 }); // 5 min

    return NextResponse.json({ mediaId: media.id, uploadUrl, key: s3Key }, { status: 201 });
  } catch (err) {
    console.error("POST /api/media/presign error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
