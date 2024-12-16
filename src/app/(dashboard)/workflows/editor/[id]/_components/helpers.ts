import { Edge, Node } from "@xyflow/react";
import { WorkflowNodeRegistry, WorkflowNodeTypes } from './constants';

export interface WorkflowNodeData {
  type: keyof typeof WorkflowNodeTypes;
  inputs: Record<string, string>;
  errors?: Record<string, string>;
  [key: string]: unknown;
}

export interface WorkflowNode extends Node {
  data: WorkflowNodeData;
}

export function createWorkflowNode(type: keyof typeof WorkflowNodeTypes, options?: { position: { x: number, y: number } }): WorkflowNode {
  return {
    id: crypto.randomUUID(),
    type: "WORKFLOW_NODE",
    dragHandle: ".drag-handle",
    position: options?.position || { x: 10, y: 10 },
    data: {
      type,
      inputs: {}
    }
  }
}

export function getNodeDetails(type: keyof typeof WorkflowNodeTypes) {
  return WorkflowNodeRegistry[type];
}

export function getInvalidNodeInputs(node: WorkflowNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs = [];

  const nodeDetails = getNodeDetails(node.data.type);
  const inputs = nodeDetails.inputs;
  for (let input of inputs) {
    const inputValue = node.data.inputs[input.label];
    if (inputValue?.length > 0) continue;
    const linkedNodesEdges = edges.filter(ed => ed.target === node.id);
    const inputLinkedByNodeEdge = linkedNodesEdges.find(ed => ed.targetHandle === input.label);
    if (input.required && inputLinkedByNodeEdge && planned.has(inputLinkedByNodeEdge.source)) continue;
    if (!input.required && !inputLinkedByNodeEdge) continue;  
    if (!input.required && inputLinkedByNodeEdge && planned.has(inputLinkedByNodeEdge.source)) continue;
    invalidInputs.push(input.label);
  }

  return invalidInputs;
}

export const WorkflowExecutionStatus = {
  RUNNING: "RUNNING",
  FAILED: "FAILED",
  COMPLETED: "COMPLETED",
}

export const WorkflowPhaseOperationStatus = {
  RUNNING: "RUNNING",
  FAILED: "FAILED",
  COMPLETED: "COMPLETED",
}

export const WorkflowExecutionTriggerType = {
  MANUAL: "MANUAL",
  CRON: "CRON",
}