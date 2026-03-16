/**
 * Construct a public URL for a media s3Key.
 * Used server-side in API routes so the frontend never needs the env var.
 */
export function getMediaUrl(s3Key: string): string {
  // Data URLs and absolute URLs are already complete — return as-is
  if (s3Key.startsWith("data:") || s3Key.startsWith("http")) return s3Key;

  const base = process.env.NEXT_PUBLIC_S3_PUBLIC_URL;
  if (base) return `${base}/${s3Key}`;

  // Fallback: construct from bucket + region
  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION ?? "us-east-1";
  const endpoint = process.env.S3_ENDPOINT;

  if (endpoint) {
    // R2 or custom endpoint — use path-style URL
    return `${endpoint}/${bucket}/${s3Key}`;
  }

  if (bucket) {
    return `https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`;
  }

  // No S3 config at all — return the key as-is (will be a broken URL)
  return s3Key;
}
