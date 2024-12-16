import { cn } from "@/utils/helpers";
import { NodeProps, useReactFlow } from "@xyflow/react";
import { memo } from "react";
import { getNodeDetails, WorkflowNodeData } from "./helpers";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { GripVerticalIcon, Trash2Icon } from "lucide-react";
import WorkflowInput from "./workflow-input";
import WorkflowOutput from "./workflow-output";

export default memo(
  function WorkflowNode({ selected, id, data }: NodeProps) {
    const { getNode, setCenter, deleteElements } = useReactFlow();
    const nodeData = data as WorkflowNodeData;
    const { icon: Icon, label, isEntryPoint, inputs, outputs } = getNodeDetails(nodeData.type);

    return (
      <div
        onDoubleClick={() => {
          const node = getNode(id);
          if (!node) return;
          const { position, measured } = node;
          if (!position || !measured) return;
          const x = position.x + ((measured?.width || 0) / 2);
          const y = position.y + ((measured?.height || 0) / 2);
          setCenter(x, y, {
            zoom: 1,
            duration: 500
          });
        }}
        className={cn("border-2 border-foreground/20 w-96 rounded-md bg-white", {
          "border-foreground": selected
        })}
      >
        <div className="bg-foreground/20 py-3 px-3 flex items-center gap-2 overflow-hidden">
          <Icon className="size-4" />
          <h3 className="text-sm font-medium uppercase leading-none">{label}</h3>

          <span className="flex items-center gap-2 ml-auto">
            {isEntryPoint && <Badge>Entry point</Badge>}

            {!isEntryPoint && <Button variant="ghost" size="icon" onClick={() => deleteElements({
              nodes: [{ id }]
            })}>
              <Trash2Icon className="size-4" />
            </Button>}
            <Button variant="ghost" size="icon" className="drag-handle cursor-grabbing">
              <GripVerticalIcon className="size-4" />
            </Button>
          </span>
        </div>

        <div className="flex flex-col gap-0 py-2 px-3">
          {inputs.map(input => (
            <WorkflowInput
              key={input.label} 
              nodeId={id}
              input={input}
              value={nodeData.inputs[input.label]}
              error={nodeData.errors?.[input.label]}
            />
          ))}
          {outputs.map(output => (
            <WorkflowOutput
              key={output.label} 
              output={output}
            />
          ))}
        </div>
      </div>
    )
  }
)