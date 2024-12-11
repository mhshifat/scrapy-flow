import { Node } from "@xyflow/react";
import { WorkflowNodeRegistry, WorkflowNodeTypes } from './constants';

export interface WorkflowNodeData {
  type: keyof typeof WorkflowNodeTypes;
  inputs: Record<string, string>;
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