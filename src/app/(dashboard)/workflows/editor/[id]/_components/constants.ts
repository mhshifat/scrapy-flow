import { GlobeIcon } from "lucide-react";

export const WorkflowNodeTypes = {
  LAUNCH_BROWSER: "LAUNCH_BROWSER"
} as const;

export const WorkflowNodeInputTypes = {
  STRING: "STRING",
} as const;

export const WorkflowNodeRegistry = {
  LAUNCH_BROWSER: {
    isEntryPoint: true,
    label: "Launch Browser",
    icon: GlobeIcon,
    inputs: [
      {
        type: WorkflowNodeInputTypes.STRING,
        label: "Website Url",
        required: true,
        hideHandle: true
      }
    ]
  }
};