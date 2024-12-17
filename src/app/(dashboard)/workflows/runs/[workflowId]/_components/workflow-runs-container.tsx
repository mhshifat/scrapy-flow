import { getWorkflowRuns } from "@/actions/workflow";
import DataNotFound from "@/components/data-not-found";
import WorkflowRunsHeader from "./workflow-runs-header";
import Table from "@/components/ui/table";
import { WorkflowExecution } from "@prisma/client";
import { getTimeDuration } from "@/utils/date";
import { cn } from "@/utils/helpers";
import { WorkflowExecutionStatus } from "../../../editor/[id]/_components/helpers";
import { formatDistanceToNow } from "date-fns";
import WorkflowRunsTable from "./workflow-runs-table";
import ClientOnly from "@/components/client-only";

export default async function WorkflowRunsContainer({ workflowId }: { workflowId: string }) {
  const runs = await getWorkflowRuns(workflowId);

  if (!runs.length) return <DataNotFound />;
  return (
    <div className="w-full">
      <WorkflowRunsHeader workflowId={workflowId} />
      <ClientOnly>
        <WorkflowRunsTable
          workflowId={workflowId}
          runs={runs}
        />
      </ClientOnly>
    </div>
  )
}