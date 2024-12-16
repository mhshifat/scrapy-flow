import { runWorkflowPlan } from "@/actions/workflow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs";
import { toast } from "@/utils/toast";
import { IWorkflowPhase } from "../workflow-header";

export function useRunWorkflowPlanMutation() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, plan }: { id: string, plan: IWorkflowPhase[] }) => {
      toast.loading("Stating workflow", { id: "STARTED_WORKFLOW" });
      return runWorkflowPlan(id, JSON.stringify(plan));
    },
    onSuccess() {
      toast.success("Started workflow", { id: "STARTED_WORKFLOW" });
      client.invalidateQueries({
        predicate: (query) => {
          return (query.queryKey?.[0] as string)?.startsWith("workflows");
        }
      });
    },
    onError(err) {
      console.error(err);
      Sentry.captureException(err);
      toast.error("Failed to start the workflow", { id: "STARTED_WORKFLOW" });
    },
  })
}