import { getWorkflowExecutionPhaseById } from "@/actions/workflow";
import { useQuery } from "@tanstack/react-query";

export default function useGetPhaseQuery(queryParams: {
  id: string | null;
}) {
  return useQuery({
    queryKey: ["execution-phase", queryParams.id],
    queryFn: () => getWorkflowExecutionPhaseById(queryParams?.id || ""),
    enabled: !!queryParams.id
  })
}