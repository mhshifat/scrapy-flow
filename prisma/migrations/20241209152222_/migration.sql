-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "desctiption" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Workflow_title_key" ON "Workflow"("title");
