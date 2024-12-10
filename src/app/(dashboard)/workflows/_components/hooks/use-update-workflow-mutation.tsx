import { updateWorkflowById } from "@/actions/workflow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs";
import { ICreateWorkflowFormValues } from "../validations";
import { toast } from "@/utils/toast";

export function useUpdateWorkflowMutation() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...values }: Partial<ICreateWorkflowFormValues> & { id: string }) => {
      toast.loading("Creating workflow", { id: "UPDATING_WORKFLOW" });
      return updateWorkflowById(id, values);
    },
    onSuccess() {
      toast.success("Successfully updated the workflow", { id: "UPDATING_WORKFLOW" });
      client.invalidateQueries({
        predicate: (query) => {
          return (query.queryKey?.[0] as string)?.startsWith("workflows");
        }
      });
    },
    onError(err) {
      console.error(err);
      Sentry.captureException(err);
      toast.error("Failed to update the workflow", { id: "UPDATING_WORKFLOW" });
    },
  })
}