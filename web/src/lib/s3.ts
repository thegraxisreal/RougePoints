/**
 * Returns the public URL for an S3/R2 object given its key.
 *
 * Resolution order:
 *  1. S3_PUBLIC_URL env var (explicit, e.g. a CDN or R2 custom domain)
 *  2. Auto-constructed from S3_BUCKET + S3_REGION (standard AWS S3)
 *  3. null — no URL can be computed
 */
export function getMediaUrl(s3Key: string): string | null {
  if (process.env.S3_PUBLIC_URL) {
    return `${process.env.S3_PUBLIC_URL.replace(/\/+$/, "")}/${s3Key}`;
  }

  // Also accept NEXT_PUBLIC_ variant (backwards compat)
  if (process.env.NEXT_PUBLIC_S3_PUBLIC_URL) {
    return `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL.replace(/\/+$/, "")}/${s3Key}`;
  }

  // Auto-construct standard AWS S3 URL
  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION || "us-east-1";
  if (bucket) {
    return `https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`;
  }

  return null;
}

/** Augment a media record with its public `url` field */
export function withMediaUrl<T extends { s3Key: string }>(
  media: T
): T & { url: string | null } {
  return { ...media, url: getMediaUrl(media.s3Key) };
}
