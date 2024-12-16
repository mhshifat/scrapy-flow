import { getWorkflowExecutionById } from "@/actions/workflow";
import ExecutionSidebar from "./execution-sidebar";
import DataNotFound from "@/components/data-not-found";
import WorkflowExecutionWrapper from "./workflow-execution-wrapper";

interface WorkflowExecutionRunsProps {
  workflowId: string;
  executionId: string;
}

export default async function WorkflowExecutionRuns({ executionId, workflowId }: WorkflowExecutionRunsProps) {
  const execution = await getWorkflowExecutionById({
    id: executionId,
    workflowId
  });

  if (!execution || !execution.id) return <DataNotFound />
  return (
    <WorkflowExecutionWrapper
      execution={execution}
    />
  )
}