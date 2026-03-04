import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

// ─── GET /api/me — returns the current user's DB id ──────────────────────────

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ id: user.id });
}
