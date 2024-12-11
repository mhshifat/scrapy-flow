import { ColorForWorkflowNodeHandle, WorkflowNodeRegistry } from "./constants";
import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import Label from "@/components/ui/label";
import { cn } from "@/utils/helpers";

function WorkflowOutput({
  output,
}: {
  output: typeof WorkflowNodeRegistry[keyof typeof WorkflowNodeRegistry]["outputs"][number]
}) {
	return (
    <Label
      title={output.label}
      required={false}
      className="py-2 relative text-right"
    >
      <Handle
        id={output.label}
        type="source"
        position={Position.Right}
        className={cn("!w-4 !h-4 !rounded-full !bg-foreground absolute !top-[calc(50%)] -translate-y-1/2 !-right-4", ColorForWorkflowNodeHandle[output.type])}
      />
    </Label>
  )
}

export default memo(WorkflowOutput);
