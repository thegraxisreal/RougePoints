import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "./db";

/**
 * Returns the signed-in user's DB record, creating it on first login.
 * Throws a 401 NextResponse if the user is not authenticated.
 */
export async function requireUser() {
  const { userId } = await auth();
  if (!userId) {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerkUser = await currentUser();

  const user = await db.user.upsert({
    where: { authId: userId },
    update: {
      email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
      avatarUrl: clerkUser?.imageUrl ?? null,
    },
    create: {
      authId: userId,
      email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
      handle: await uniqueHandle(clerkUser?.username ?? clerkUser?.firstName ?? "user"),
      avatarUrl: clerkUser?.imageUrl ?? null,
    },
  });

  return user;
}

/** Generates a unique handle, appending a number if already taken. */
async function uniqueHandle(base: string): Promise<string> {
  const slug = base.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20) || "user";
  const existing = await db.user.findUnique({ where: { handle: slug } });
  if (!existing) return slug;

  // Append random suffix
  const suffix = Math.floor(Math.random() * 9000) + 1000;
  return `${slug}${suffix}`;
}
