"use client";

import Button from "@/components/ui/button"
import { WorkflowNodeTypes } from "./constants"
import { getNodeDetails } from "./helpers"
import React, { useCallback } from "react";

interface WorkflowBtnProps {
  type: keyof typeof WorkflowNodeTypes
}

export default function WorkflowBtn({ type }: WorkflowBtnProps) {
  const { icon: Icon, label } = getNodeDetails(type);

  const onDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData("WORKFLOW_MENU::DRAG", type);
    e.dataTransfer.effectAllowed = "move";
  }, [])
  return (
    <Button
      variant="ghost"
      className="flex items-center gap-3"
      draggable
      onDragStart={onDragStart}
    >
      <Icon className="size-4" />
      <h3>{label}</h3>
    </Button>
  )
}