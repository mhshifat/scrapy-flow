/*
  Warnings:

  - You are about to alter the column `lastRunAt` on the `Workflow` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Workflow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "definition" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "lastRunAt" DATETIME,
    "lastRunStatus" TEXT,
    "lastRunId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Workflow" ("createdAt", "definition", "description", "id", "lastRunAt", "lastRunId", "lastRunStatus", "status", "title", "updatedAt") SELECT "createdAt", "definition", "description", "id", "lastRunAt", "lastRunId", "lastRunStatus", "status", "title", "updatedAt" FROM "Workflow";
DROP TABLE "Workflow";
ALTER TABLE "new_Workflow" RENAME TO "Workflow";
CREATE UNIQUE INDEX "Workflow_title_key" ON "Workflow"("title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
