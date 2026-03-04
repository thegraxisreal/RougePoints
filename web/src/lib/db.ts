import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function makeClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const authToken = process.env.TURSO_AUTH_TOKEN;
  const adapter = new PrismaLibSql({ url, authToken });
  return new PrismaClient({ adapter });
}

declare global {
  // eslint-disable-next-line no-var
  var __prisma: ReturnType<typeof makeClient> | undefined;
}

export const db = globalThis.__prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = db;
}
