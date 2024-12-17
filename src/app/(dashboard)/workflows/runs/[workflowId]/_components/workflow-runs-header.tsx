"use client";

import Button from "@/components/ui/button";
import Tab from "@/components/ui/tab";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

interface WorkflowRunsHeaderProps {
  workflowId: string;
}

export default function WorkflowRunsHeader({ workflowId }: WorkflowRunsHeaderProps) {
  return (
    <div className="w-full flex items-center justify-between gap-5 border-b border-foreground/10 py-2 px-3">
      <div className="flex items-center gap-3 flex-1">
        <Button variant="ghost" size="icon">
          <ChevronLeftIcon className="size-6" />
        </Button>

        <div>
          <h3 className="text-xl font-medium">All runs</h3>
          <p className="text-sm font-medium text-foreground/60">List of all your workflow runs </p>
        </div>
      </div>

      <Tab>
        <Tab.List className="flex items-center">
          <Tab.Item>
            <Link href={`/workflows/editor/${workflowId}`}>Editor</Link>
          </Tab.Item>
          <Tab.Item>
            <Link href={`/workflows/runs/${workflowId}`}>Runs</Link>
          </Tab.Item>
        </Tab.List>
      </Tab>

      <div className="flex items-center gap-2 flex-1" />
    </div>
  )
}