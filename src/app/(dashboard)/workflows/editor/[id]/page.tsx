import { Suspense } from "react";
import WorkflowEditorSkeleton from "./_components/workflow-editor-skeleton";
import WorkflowEditorContainer from "./_components/workflow-editor-container";

export default async function WorkflowEditorPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<WorkflowEditorSkeleton />}>
      <WorkflowEditorContainer
        workflowId={id}
      />
    </Suspense>
  )
}