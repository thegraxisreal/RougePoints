import { PrismaClient } from "@prisma/client";

function makeClient() {
  const url = process.env.DATABASE_URL;

  // Turso / remote libSQL — use the driver adapter
  if (url?.startsWith("libsql://") || url?.startsWith("wss://")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@libsql/client");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    const adapter = new PrismaLibSql(createClient({ url }));
    return new PrismaClient({ adapter });
  }

  // Local SQLite file — standard client
  return new PrismaClient();
}

declare global {
  // eslint-disable-next-line no-var
  var __prisma: ReturnType<typeof makeClient> | undefined;
}

export const db = globalThis.__prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = db;
}
