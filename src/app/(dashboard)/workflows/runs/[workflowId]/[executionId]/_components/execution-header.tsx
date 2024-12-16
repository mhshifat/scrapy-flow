"use client";

import Button from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";

interface ExecutionHeaderProps {
  executionId: string;
}

export default function ExecutionHeader({ executionId }: ExecutionHeaderProps) {
  return (
    <div className="w-full flex items-center gap-5 border-b border-foreground/10 py-2 px-3">
      <div className="flex items-center gap-3 flex-1">
        <Button variant="ghost" size="icon">
          <ChevronLeftIcon className="size-6" />
        </Button>

        <div>
          <h3 className="text-xl font-medium">Workflow run details</h3>
          <p className="text-sm font-medium text-foreground/60">Run: {executionId}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        
      </div>
    </div>
  )
}