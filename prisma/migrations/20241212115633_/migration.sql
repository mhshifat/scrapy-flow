-- CreateTable
CREATE TABLE "WorkflowPhaseOperation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'RUNNING',
    "phase" INTEGER NOT NULL,
    "node" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inputs" TEXT,
    "outputs" TEXT,
    "startedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "workflowExecutionId" TEXT NOT NULL,
    CONSTRAINT "WorkflowPhaseOperation_workflowExecutionId_fkey" FOREIGN KEY ("workflowExecutionId") REFERENCES "WorkflowExecution" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
