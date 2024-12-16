import { getWorkflowExecutionById } from "@/actions/workflow";
import { WorkflowExecutionStatus } from "@/app/(dashboard)/workflows/editor/[id]/_components/helpers";
import { useQuery } from "@tanstack/react-query";

export default function useLiveExecutionWithPhases(queryParams: {
  id: string;
  workflowId: string;
}) {
  return useQuery({
    queryKey: ["execution", queryParams.id],
    queryFn: () => getWorkflowExecutionById(queryParams),
    refetchInterval: (q) => q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false
  })
}