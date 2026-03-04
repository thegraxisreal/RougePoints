import { NextRequest, NextResponse } from "next/server";

const ADMIN_CODE = process.env.ADMIN_CODE ?? "1612";

// ─── POST /api/admin/verify — check admin code ──────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || body.code !== ADMIN_CODE) {
    return NextResponse.json({ error: "Invalid code" }, { status: 403 });
  }
  return NextResponse.json({ ok: true });
}
