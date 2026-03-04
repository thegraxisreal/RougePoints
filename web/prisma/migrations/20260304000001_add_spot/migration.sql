-- CreateTable
CREATE TABLE "Spot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'school'
);

-- AlterTable: add spotId to Pin (nullable, no FK enforcement at DB level for SQLite)
ALTER TABLE "Pin" ADD COLUMN "spotId" TEXT;
