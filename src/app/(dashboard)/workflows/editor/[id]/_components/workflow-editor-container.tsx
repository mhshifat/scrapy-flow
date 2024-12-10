import { getWorkflowById } from "@/actions/workflow";
import DataNotFound from "@/components/data-not-found";
import WorkflowEditor from "./workflow-editor";
import { ReactFlowProvider } from "@xyflow/react";
import ClientOnly from "@/components/client-only";
import WorkflowHeader from "./workflow-header";

interface WorkflowEditorContainerProps {
  workflowId: string;
}

export default async function WorkflowEditorContainer({ workflowId }: WorkflowEditorContainerProps) {
  const workflow = await getWorkflowById(workflowId);
  
  if (!workflow) return <DataNotFound />
  return (
    <ClientOnly>
      <div className="h-screen flex flex-col">
        <ReactFlowProvider>
          <WorkflowHeader
            workflow={workflow}
          />
          <WorkflowEditor
            workflow={workflow}
          />
        </ReactFlowProvider>
      </div>
    </ClientOnly>
  )
}