"use client";

import Table from "@/components/ui/table";
import { getTimeDuration } from "@/utils/date";
import { cn } from "@/utils/helpers";
import { WorkflowExecution } from "@prisma/client";
import { useRouter } from "next/navigation";
import { WorkflowExecutionStatus } from "../../../editor/[id]/_components/helpers";
import { formatDistanceToNow } from "date-fns";

interface WorkflowRunsTableProps {
  workflowId: string;
  runs: WorkflowExecution[];
}

export default function WorkflowRunsTable({ runs, workflowId }: WorkflowRunsTableProps) {
  const router = useRouter();

  return (
    <Table<{ id: string }>
      identifier="id"
      headers={[
        { title: "Id", key: "", cell: (data) => {
          const runDetails = data as WorkflowExecution;
          return (
            <div>
              <h3>{runDetails.id}</h3>
              <p>Triggers via <span>{runDetails.trigger}</span></p>
            </div>
          )
        } },
        { title: "Status", key: "", cell: (data) => {
          const runDetails = data as WorkflowExecution;
          const duration = getTimeDuration(runDetails?.startedAt, runDetails?.completedAt);
          return (
            <div>
              <div className="flex items-center gap-2">
                <span className={cn("flex items-center justify-center w-2 h-2 rounded-full bg-foreground/60", {
                  "bg-danger": runDetails.status === WorkflowExecutionStatus.FAILED,
                  "bg-success": runDetails.status === WorkflowExecutionStatus.COMPLETED,
                })} />
                <span>{runDetails.status}</span>
              </div>
              <div>{duration}</div>
            </div>
          )
        } },
        { title: "Started at", key: "", cell: (data) => {
          const runDetails = data as WorkflowExecution;
          return (
            <div>
              {runDetails?.startedAt ? formatDistanceToNow(new Date(runDetails.startedAt), { addSuffix: true }) : "-"}
            </div>
          )
        } },
      ]}
      data={runs}
      emptyText={<p className="text-sm text-foreground/60">No runs found for this workflow</p>}
      row={({ children, data, defaultProps: { key } }) => {
        return (
          <tr
            key={key}
            className="cursor-pointer"
            onClick={() => router.push(`/workflows/runs/${workflowId}/${data.id}`)}
          >{children}</tr>
        )
      }}
    />
  )
}