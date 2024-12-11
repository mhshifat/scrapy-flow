import Button from "@/components/ui/button";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, useReactFlow } from "@xyflow/react";
import { XIcon } from "lucide-react";

export default function DeletableEdge(props: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath(props);
  const { setEdges } = useReactFlow();

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all"
          }}
        >
          <Button size="icon" onClick={() => setEdges(eds => eds.filter(ed => ed.id !== props.id))}>
            <XIcon className="size-4" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}