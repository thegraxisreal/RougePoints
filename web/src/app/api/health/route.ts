import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL ?? "(not set)";
  const token = process.env.TURSO_AUTH_TOKEN;

  const checks: Record<string, string> = {
    DATABASE_URL: dbUrl.startsWith("libsql://")
      ? dbUrl.slice(0, 30) + "..."
      : dbUrl.slice(0, 20) + "...",
    TURSO_AUTH_TOKEN: token
      ? `set (${token.length} chars, starts: ${token.slice(0, 10)}...)`
      : "(not set)",
  };

  try {
    const count = await db.pin.count();
    checks.db_connection = `OK — ${count} pins in database`;
  } catch (err) {
    checks.db_connection = `FAILED — ${err instanceof Error ? err.message : String(err)}`;
  }

  return NextResponse.json(checks);
}
