-- RedefineTables
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Pin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'visible',
    "fireCount" INTEGER NOT NULL DEFAULT 0,
    "skullCount" INTEGER NOT NULL DEFAULT 0,
    "heartCount" INTEGER NOT NULL DEFAULT 0,
    "laughCount" INTEGER NOT NULL DEFAULT 0,
    "wowCount" INTEGER NOT NULL DEFAULT 0,
    "spotId" TEXT,
    CONSTRAINT "Pin_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pin_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO "new_Pin" SELECT "id", "createdAt", "updatedAt", "authorId", "lat", "lng", "title", "category", "status", "fireCount", "skullCount", "heartCount", "laughCount", "wowCount", "spotId" FROM "Pin";

DROP TABLE "Pin";
ALTER TABLE "new_Pin" RENAME TO "Pin";

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
