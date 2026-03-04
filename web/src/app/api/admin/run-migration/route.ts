import { createClient } from "@libsql/client";
import { NextResponse } from "next/server";

export async function GET() {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Spot" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "name" TEXT NOT NULL,
      "lat" REAL NOT NULL,
      "lng" REAL NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'school'
    )
  `);

  try {
    await client.execute(`ALTER TABLE "Pin" ADD COLUMN "spotId" TEXT`);
  } catch {
    // column already exists — that's fine
  }

  return NextResponse.json({ ok: true, message: "Migration applied successfully" });
}
