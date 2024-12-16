"use client";

import Button from "@/components/ui/button";
import { Workflow } from "@prisma/client";
import { Edge, getIncomers, ReactFlowJsonObject, useReactFlow } from "@xyflow/react";
import { ChevronLeftIcon } from "lucide-react";
import { useUpdateWorkflowMutation } from "../../../_components/hooks/use-update-workflow-mutation";
import { WorkflowStatus } from "../../../_components/constants";
import { WorkflowNodeRegistry } from "./constants";
import { getInvalidNodeInputs, WorkflowNode } from "./helpers";
import { catchAsync } from "@/utils/errors";
import { useRunWorkflowPlanMutation } from "./hooks/use-run-workflow-plan-mutation";
import { useRouter } from "next/navigation";

interface WorkflowHeaderProps {
  workflow: Workflow;
}

export interface IWorkflowPhase { phase: number, nodes: WorkflowNode[] }[]

export default function WorkflowHeader({ workflow }: WorkflowHeaderProps) {
  const router = useRouter();
  const { toObject, updateNodeData } = useReactFlow();
  const updateWorkflow = useUpdateWorkflowMutation();
  const runWorkflowPlan = useRunWorkflowPlanMutation();

  const loading = updateWorkflow.isPending;
  const disabled = workflow.status === WorkflowStatus.ACTIVE || loading;

  function handleSave() {
    updateWorkflow.mutateAsync({
      ...workflow,
      definition: JSON.stringify(toObject())
    })
  }
  async function executeWorkflow() {
    const { nodes, edges } = toObject() as ReactFlowJsonObject<WorkflowNode, Edge>;
    const entryPoint = nodes.find(n => WorkflowNodeRegistry[n.data.type].isEntryPoint);
    if (!entryPoint) throw new Error("Invalid flow");
    const planned = new Set<string>();
    planned.add(entryPoint.id);
    let isValid = true;
    const executionPlan: IWorkflowPhase[] = [
      {
        phase: 1,
        nodes: [entryPoint]
      }
    ];

    for (
      let phase = 2;
      phase <= nodes.length && planned.size < nodes.length;
      phase++
    ) {
      const nextPhase: { phase: number, nodes: WorkflowNode[] } = { phase, nodes: [] };
      for (let currentNode of nodes) {
        if (planned.has(currentNode.id)) continue;
        const invalidInputs = getInvalidNodeInputs(currentNode, edges, planned);
        if (invalidInputs.length > 0) {
          const incomers = getIncomers(currentNode, nodes, edges);
          const incomersArePlanned = incomers.every(incomer => planned.has(incomer.id));
          if (incomersArePlanned) {
            const newData = {
              ...currentNode?.data,
              errors: {
                ...currentNode?.data?.errors,
              }
            }
            for (let input of invalidInputs) {
              newData.errors[input] = "Field is required";
            }
            updateNodeData(currentNode.id, newData);
            isValid = false;
          }
          continue;
        }
        nextPhase.nodes.push(currentNode);
      }
      for (let node of nextPhase.nodes) {
        planned.add(node.id);
      }
      executionPlan.push(nextPhase);
    }

    if (!isValid) return;
    try {
      const execution = await runWorkflowPlan.mutateAsync({
        id: workflow.id,
        plan: executionPlan
      });
      if (!execution?.id) return;
      router.push(`/workflows/runs/${execution.workflowId}/${execution.id}`);
    } catch (err) {}
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

      <div className="ml-auto flex items-center gap-2">
        <Button disabled={runWorkflowPlan.isPending} loading={runWorkflowPlan.isPending} onClick={() => catchAsync(executeWorkflow, {
          name: "Workflow",
          operation: "Workflow execution failed"
        })}>Execute</Button>
        <Button disabled={disabled} loading={loading} onClick={handleSave}>Save</Button>
      </div>
    </div>
  )
}