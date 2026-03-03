import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

const VALID_REASONS = ["spam", "harassment", "inappropriate", "misinformation", "other"] as const;

// Auto-hide threshold: 3 reports triggers status → "hidden"
const HIDE_THRESHOLD = 3;

// Stub until auth is wired up
const STUB_USER_ID = "stub";

// ─── POST /api/pins/[id]/reports ──────────────────────────────────────────────
// Body: { reason: string, notes?: string }
// One report per user per pin. Auto-hides pin when report count hits threshold.

export async function POST(req: NextRequest, { params }: Params) {
  const { id: pinId } = await params;
  const body = await req.json().catch(() => null);
  const { reason, notes } = body ?? {};

  if (!VALID_REASONS.includes(reason)) {
    return NextResponse.json(
      { error: "reason must be one of: spam, harassment, inappropriate, misinformation, other" },
      { status: 400 }
    );
  }

  const pin = await db.pin.findUnique({ where: { id: pinId } });
  if (!pin || pin.status === "removed") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // One report per user per pin (unique constraint will reject duplicates)
  const existing = await db.report.findUnique({
    where: { reporterId_pinId: { reporterId: STUB_USER_ID, pinId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Already reported" }, { status: 409 });
  }

  await db.report.create({
    data: {
      reporterId: STUB_USER_ID,
      pinId,
      reason,
      notes: notes ?? null,
    },
  });

  // Check total open reports and auto-hide if threshold reached
  const reportCount = await db.report.count({
    where: { pinId, status: "open" },
  });

  if (reportCount >= HIDE_THRESHOLD && pin.status === "visible") {
    await db.pin.update({ where: { id: pinId }, data: { status: "hidden" } });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
