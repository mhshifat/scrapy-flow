"use client";

import Button from "@/components/ui/button";
import { Workflow } from "@prisma/client";
import { useReactFlow } from "@xyflow/react";
import { ChevronLeftIcon } from "lucide-react";
import { useUpdateWorkflowMutation } from "../../../_components/hooks/use-update-workflow-mutation";
import { WorkflowStatus } from "../../../_components/constants";

interface WorkflowHeaderProps {
  workflow: Workflow;
}

export default function WorkflowHeader({ workflow }: WorkflowHeaderProps) {
  const { toObject } = useReactFlow();
  const updateWorkflow = useUpdateWorkflowMutation();

  const loading = updateWorkflow.isPending;
  const disabled = workflow.status === WorkflowStatus.ACTIVE || loading;

  function handleSave() {
    updateWorkflow.mutateAsync({
      ...workflow,
      definition: JSON.stringify(toObject())
    })
  }
  return (
    <div className="w-full flex items-center gap-5 border-b border-foreground/10 py-2 px-3">
      <div className="flex items-center gap-3 flex-1">
        <Button variant="ghost" size="icon">
          <ChevronLeftIcon className="size-6" />
        </Button>

        <div>
          <h3 className="text-xl font-medium">{workflow.title}</h3>
          <p className="text-sm font-medium text-foreground/60">{workflow.description}</p>
        </div>
      </div>

      <div className="ml-auto">
        <Button disabled={disabled} loading={loading} onClick={handleSave}>Save</Button>
      </div>
    </div>
  )
}