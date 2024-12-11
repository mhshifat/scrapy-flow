"use client";

import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, getOutgoers, Node, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import WorkflowNode from './workflow-node';
import { Workflow } from '@prisma/client';
import React, { useCallback, useEffect } from 'react';
import { createWorkflowNode, WorkflowNode as IWorkflowNode } from './helpers';
import { WorkflowNodeRegistry, WorkflowNodeTypes } from './constants';
import DeletableEdge from './deletable-edge';

interface WorkflowEditorProps {
  workflow: Workflow;
}

const nodeTypes = {
  WORKFLOW_NODE: WorkflowNode
}

const edgeTypes = {
  default: DeletableEdge
}

export default function WorkflowEditor({ workflow }: WorkflowEditorProps) {
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<IWorkflowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.effectAllowed = 'move';
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });
    const menuType = e.dataTransfer.getData("WORKFLOW_MENU::DRAG") as keyof typeof WorkflowNodeTypes;
    const node = createWorkflowNode(menuType, {
      position
    });
    setNodes(nodes => nodes.concat(node))
  }, [])

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({...connection, animated: true}, eds));
    const targetNode = nodes.find(n => n.id === connection.target);
    if (!connection.targetHandle || !targetNode) return;
    const inputs = targetNode?.data?.inputs;
    delete inputs?.[connection.targetHandle];
    updateNodeData(targetNode.id, {
      ...targetNode.data,
      inputs
    })
  }, [nodes])

  const isValidConnection = useCallback((connection: Connection | Edge) => {
    if (connection.source === connection.target) return false;
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    if (!sourceNode || !targetNode) return false;
    const sourceDetails = WorkflowNodeRegistry[sourceNode.data.type];
    const targetDetails = WorkflowNodeRegistry[targetNode.data.type];
    const sourceOutput = sourceDetails?.outputs?.find((item) => item.label === connection.sourceHandle);
    const targetInput = targetDetails?.inputs?.find((item) => item.label === connection.targetHandle);
    if (sourceOutput?.type !== targetInput?.type) return false;
    const hasCycle = (node: Node, visited = new Set()) => {
      if (visited.has(node.id)) return false;

      visited.add(node.id);

      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === connection.source) return true;
        if (hasCycle(outgoer, visited)) return true;
      }
    };
    
    return !hasCycle(targetNode);
  }, [nodes])

  useEffect(() => {
    if (!workflow) return;

    const { nodes, edges, viewport } = JSON.parse(workflow.definition || "");
    setNodes(nodes);
    setEdges(edges);
    setViewport(viewport);
  }, [workflow])

  return (
    <div className='h-full flex-1'>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapGrid={[50, 50]}
        snapToGrid
        fitView
        fitViewOptions={{ padding: 1 }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position='top-left' fitViewOptions={{ padding: 2 }} />
        <Background variant={BackgroundVariant.Dots} gap={12} />
      </ReactFlow>
    </div>
  )
}