"use client";

import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import WorkflowNode from './workflow-node';
import { Workflow } from '@prisma/client';
import { useEffect } from 'react';

interface WorkflowEditorProps {
  workflow: Workflow;
}

const nodeTypes = {
  WORKFLOW_NODE: WorkflowNode
}

export default function WorkflowEditor({ workflow }: WorkflowEditorProps) {
  const { setViewport } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!workflow) return;

    const { nodes, edges, viewport } = JSON.parse(workflow.definition || "");
    setNodes(nodes);
    setEdges(edges);
    setViewport(viewport);
  }, [workflow])

  return (
    <div className='h-full'>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        snapGrid={[50, 50]}
        snapToGrid
        fitView
        fitViewOptions={{ padding: 2 }}
      >
        <Controls position='top-left' fitViewOptions={{ padding: 2 }} />
        <Background variant={BackgroundVariant.Dots} gap={12} />
      </ReactFlow>
    </div>
  )
}