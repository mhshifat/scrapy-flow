/*
  Warnings:

  - Added the required column `definition` to the `Workflow` table without a default value. This is not possible if the table is not empty.

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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Workflow" ("createdAt", "description", "id", "status", "title", "updatedAt") SELECT "createdAt", "description", "id", "status", "title", "updatedAt" FROM "Workflow";
DROP TABLE "Workflow";
ALTER TABLE "new_Workflow" RENAME TO "Workflow";
CREATE UNIQUE INDEX "Workflow_title_key" ON "Workflow"("title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
