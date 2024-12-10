import { Suspense } from "react";
import WorkflowListSkelton from "./_components/workflow-list-skelton";
import WorkflowList from "./_components/workflow-list";
import Header from "@/components/ui/header";
import CreateWorkflowBtn from "./_components/create-workflow-btn";

export default function WorkflowsPage() {
  return (
    <div className="flex flex-col gap-10">
      <Header className="flex-row items-center gap-10">
        <div className="flex-1">
          <Header.Title>Workflows</Header.Title>
          <Header.Description>Manage your workflows</Header.Description>
        </div>

        <CreateWorkflowBtn />
      </Header>
      <Suspense fallback={<WorkflowListSkelton />}>
        <WorkflowList />
      </Suspense>
    </div>
  )
}