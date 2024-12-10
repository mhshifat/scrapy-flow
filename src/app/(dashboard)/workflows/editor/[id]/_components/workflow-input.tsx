import { Input } from "@/components/ui/input";
import { WorkflowNodeInputTypes, WorkflowNodeRegistry } from "./constants";
import { memo, PropsWithChildren, useState } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { WorkflowNode, WorkflowNodeData } from "./helpers";

function WorkflowInput({
  input,
  nodeId
}: {
  nodeId: string;
  input: typeof WorkflowNodeRegistry[keyof typeof WorkflowNodeRegistry]["inputs"][number]
}) {
	const [value, setValue] = useState("");
	const { getNode, updateNodeData } = useReactFlow();
	const node = getNode(nodeId) as WorkflowNode;

	function updateNodeInput() {
		updateNodeData(nodeId, {
			...node?.data,
			inputs: {
				[input.label]: value,
			},
		} as WorkflowNodeData);
	}

	switch (input.type) {
		case WorkflowNodeInputTypes.STRING:
			return (
				<WorkflowInput.Handle hideHandle={input.hideHandle}>
					<Input
						value={value || node?.data?.inputs?.[input.label]}
						onChange={({ target }) => setValue(target.value)}
						onBlur={updateNodeInput}
					/>
				</WorkflowInput.Handle>
			);
		default:
			return <></>;
	}
}

interface WorkflowInputHandleProps {
	hideHandle: boolean;
}

WorkflowInput.Handle = ({
	children,
	hideHandle,
}: PropsWithChildren<WorkflowInputHandleProps>) => {
	return (
		<>
			{children}
			{!hideHandle && (
				<Handle
					type="target"
					position={Position.Left}
					className="!w-3 !h-3 !rounded-full !bg-foreground absolute !top-[calc(50%+11px)] -translate-y-1/2 !-left-4"
				/>
			)}
		</>
	);
};

export default memo(WorkflowInput);
