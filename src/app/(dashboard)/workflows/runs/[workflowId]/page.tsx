import { Suspense } from "react";
import WorkflowRunsSkeleton from "./_components/workflow-runs-skeleton";
import WorkflowRunsContainer from "./_components/workflow-runs-container";

export default async function WorkflowRuns({ params: paramsPromise }: { params: { workflowId: string } }) {
  const params = await paramsPromise;

  return (
    <Suspense fallback={<WorkflowRunsSkeleton />}>
      <WorkflowRunsContainer
        workflowId={params.workflowId}
      />
    </Suspense>
  )
}