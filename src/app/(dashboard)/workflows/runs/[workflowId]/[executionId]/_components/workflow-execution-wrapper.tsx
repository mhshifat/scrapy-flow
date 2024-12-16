"use client";

import { getWorkflowExecutionById } from "@/actions/workflow";
import ExecutionSidebar from "./execution-sidebar";
import { useCallback, useState } from "react";
import WorkflowExecutionPhaseDetails from "./workflow-execution-phase-details";

interface WorkflowExecutionWrapperProps {
  execution: Awaited<ReturnType<typeof getWorkflowExecutionById>>
}

export default function WorkflowExecutionWrapper({ execution }: WorkflowExecutionWrapperProps) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const onSelectPhase = useCallback((phaseId: string) => setSelectedPhase(phaseId), []);

  return (
    <div className="flex items-start flex-1">
      <ExecutionSidebar
        executionId={execution?.id || ""}
        workflowId={execution?.workflowId || ""}
        selectedPhase={selectedPhase}
        onSelectPhase={onSelectPhase}
      />
      <WorkflowExecutionPhaseDetails
        selectedPhase={selectedPhase}
      />
    </div>
  )
}