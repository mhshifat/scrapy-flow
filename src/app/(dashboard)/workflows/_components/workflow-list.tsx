import { getWorkflows } from "@/actions/workflow";
import DataNotFound from "@/components/data-not-found";
import WorkflowCard from "./workflow-card";

export default async function WorkflowList() {
  const workflows = await getWorkflows();

  return (
    <div className="flex flex-col">
      {!workflows.length && (
        <DataNotFound />
      )}
      {workflows.map(workflow => (
        <WorkflowCard
          key={workflow.id}
          workflow={workflow}
        />
      ))}
    </div>
  )
}