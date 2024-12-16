import { Input } from "@/components/ui/input";
import {
	ColorForWorkflowNodeHandle,
	WorkflowNodeInputTypes,
	WorkflowNodeRegistry,
} from "./constants";
import React, {
	FunctionComponent,
	memo,
	PropsWithChildren,
	useEffect,
	useState,
} from "react";
import { Handle, Position, useEdges, useReactFlow } from "@xyflow/react";
import { WorkflowNode, WorkflowNodeData } from "./helpers";
import Label from "@/components/ui/label";
import { cn } from "@/utils/helpers";
import { Textarea } from "@/components/ui/textarea";

function WorkflowInput({
	input,
	value: propsValue,
	nodeId,
	error,
}: {
	nodeId: string;
	input: (typeof WorkflowNodeRegistry)[keyof typeof WorkflowNodeRegistry]["inputs"][number];
	value: string;
	error?: string;
}) {
  const edges = useEdges();
	const [value, setValue] = useState("");
	const { getNode, updateNodeData } = useReactFlow();

  const isConnected = edges.some(ed => ed.target === nodeId && ed.targetHandle === input.label);
	const node = getNode(nodeId) as WorkflowNode;
	let InputComponent: FunctionComponent<{
		value: string;
		onChange: (
			e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
		) => void;
		onBlur: (
			e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
		) => void;
    disabled: boolean;
	}> = Input;
	if ("variant" in input && input.variant === "textarea")
		InputComponent = Textarea;

	useEffect(() => {
		setValue(propsValue || "");
	}, [propsValue]);

	function updateNodeInput() {
    const newValue = {
			...node?.data,
			inputs: {
				[input.label]: value,
			},
		}
    delete newValue?.errors?.[input.label];
		updateNodeData(nodeId, newValue as WorkflowNodeData);
	}

	switch (input.type) {
		case WorkflowNodeInputTypes.STRING:
			return (
				<Label
					title={input.label}
					required={input.required}
					className="py-2 relative"
          error={error}
				>
					<WorkflowInput.Handle
            isConnectable={!isConnected}
						label={input.label}
						type={input.type}
						hideHandle={input.hideHandle}
					>
						<InputComponent
							value={value}
							onChange={({ target }) => setValue(target.value)}
							onBlur={updateNodeInput}
              disabled={isConnected}
						/>
					</WorkflowInput.Handle>
				</Label>
			);
		case WorkflowNodeInputTypes.BROWSER_INSTANCE:
			return (
				<Label title="" required={false} className="py-2 relative" error={error}>
					<WorkflowInput.Handle
            isConnectable={!isConnected}
						label={input.label}
						type={input.type}
						hideHandle={false}
					>
						{input.label}
					</WorkflowInput.Handle>
				</Label>
			);
		default:
			return (
				<Label title="" required={false} className="py-2 relative">
					<WorkflowInput.Handle
            isConnectable={false}
						label={""}
						type={"BROWSER_INSTANCE"}
						hideHandle={false}
					>
						Not Implemented
					</WorkflowInput.Handle>
				</Label>
			);
	}
}

interface WorkflowInputHandleProps {
	label: string;
	hideHandle: boolean;
	type: keyof typeof WorkflowNodeInputTypes;
  isConnectable: boolean;
}

WorkflowInput.Handle = ({
	type,
	children,
	hideHandle,
	label,
  isConnectable
}: PropsWithChildren<WorkflowInputHandleProps>) => {
	return (
		<>
			{children}
			{!hideHandle && (
				<Handle
					id={label}
					type="target"
          isConnectable={isConnectable}
					position={Position.Left}
					className={cn(
						"!w-4 !h-4 !rounded-full !bg-foreground absolute !top-[calc(50%)] -translate-y-1/2 !-left-4",
						ColorForWorkflowNodeHandle[type]
					)}
				/>
			)}
		</>
	);
};

export default memo(WorkflowInput);
