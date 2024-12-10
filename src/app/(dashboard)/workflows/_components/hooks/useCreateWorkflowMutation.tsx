import { createWorkflow } from "@/actions/workflow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs";
import { ICreateWorkflowFormValues } from "../validations";
import { toast } from "@/utils/toast";
import { WorkflowStatus } from "../constants";

export function useCreateWorkflowMutation() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (values: ICreateWorkflowFormValues) => {
      toast.loading("Creating workflow", { id: "CREATING_WORKFLOW" });
      return createWorkflow({
        title: values.title,
        description: values.description || null,
        status: WorkflowStatus.DRAFT,
      });
    },
    onSuccess() {
      toast.success("Successfully created the workflow", { id: "CREATING_WORKFLOW" });
      client.invalidateQueries({
        predicate: (query) => {
          return (query.queryKey?.[0] as string)?.startsWith("workflows");
        }
      });
    },
    onError(err) {
      console.error(err);
      Sentry.captureException(err);
      toast.error("Failed to create the workflow", { id: "CREATING_WORKFLOW" });
    },
  })
}