import { Suspense } from "react";
import ExecutionHeader from "./_components/execution-header";
import WorkflowExecutionRunsSkeleton from "./_components/workflow-execution-runs-skeleton";
import WorkflowExecutionRuns from "./_components/workflow-execution-runs";

export default async function WorkflowExecution({ params: paramsAsync }: { params: { executionId: string, workflowId: string } }) {
  const params = await paramsAsync;

  return (
    <div className="w-full h-screen flex flex-col">
      <ExecutionHeader
        executionId={params.executionId}
      />

      <Suspense
        fallback={<WorkflowExecutionRunsSkeleton />}
      >
        <WorkflowExecutionRuns
          executionId={params.executionId}
          workflowId={params.workflowId}
        />
      </Suspense>
    </div>
  )
}