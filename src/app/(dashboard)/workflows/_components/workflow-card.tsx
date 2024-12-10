import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Workflow } from "@prisma/client"
import { ShuffleIcon, WaypointsIcon } from "lucide-react";
import Link from "next/link";

interface WorkflowCardProps {
  workflow: Workflow;
}

export default function WorkflowCard({ workflow }: WorkflowCardProps) {
  return (
    <div className="flex items-center gap-5 justify-between border border-foreground/10 rounded-md py-3 px-5">
      <div className="flex items-center gap-3">
        <WaypointsIcon className="size-7" />

        <h3 className="text-xl capitalize text-foreground/60 font-medium">{workflow.title}</h3>
        <Badge>{workflow.status}</Badge>
      </div>

      <div>
        <Link href={`/workflows/editor/${workflow.id}`}>
          <Button className="flex items-center gap-2">
            <ShuffleIcon className="size-4" />
            <span>Edit</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}