import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function getS3Client() {
  const config: ConstructorParameters<typeof S3Client>[0] = {
    region: process.env.S3_REGION ?? "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  };
  // Support Cloudflare R2 or other S3-compatible endpoints
  if (process.env.S3_ENDPOINT) {
    config.endpoint = process.env.S3_ENDPOINT;
    config.forcePathStyle = true;
  }
  return new S3Client(config);
}

// ─── POST /api/media/presign ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { pinId, mimeType, filename } = body;

  if (!pinId || !mimeType || !filename) {
    return NextResponse.json(
      { error: "pinId, mimeType, and filename are required" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.has(mimeType)) {
    return NextResponse.json(
      { error: "Unsupported image type. Allowed: jpeg, png, webp, gif" },
      { status: 400 }
    );
  }

  // Verify the pin exists and belongs to this user
  const pin = await db.pin.findUnique({ where: { id: pinId } });
  if (!pin || pin.authorId !== user.id) {
    return NextResponse.json({ error: "Pin not found" }, { status: 404 });
  }

  // Create the media record
  const ext = EXT_MAP[mimeType] ?? "bin";
  const media = await db.media.create({
    data: {
      pinId,
      s3Key: "", // placeholder, updated below
      mimeType,
      state: "pending",
    },
  });

  const s3Key = `pins/${pinId}/${media.id}.${ext}`;

  // Update with the real key
  await db.media.update({
    where: { id: media.id },
    data: { s3Key },
  });

  // Generate presigned PUT URL
  const s3 = getS3Client();
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: s3Key,
    ContentType: mimeType,
    ContentLength: MAX_SIZE, // used in policy condition
  });

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 600, // 10 minutes
  });

  return NextResponse.json({
    mediaId: media.id,
    uploadUrl,
    key: s3Key,
  });
}
