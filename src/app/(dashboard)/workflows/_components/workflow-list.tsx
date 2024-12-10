import { getWorkflows } from "@/actions/workflow";

export default async function WorkflowList() {
  const workflows = await getWorkflows();

  return (
    <span>WorkflowList</span>
  )
}