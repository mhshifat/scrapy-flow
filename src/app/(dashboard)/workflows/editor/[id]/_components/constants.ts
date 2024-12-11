import { CodeIcon, GlobeIcon, TextIcon } from "lucide-react";

export const WorkflowNodeTypes = {
  LAUNCH_BROWSER: "LAUNCH_BROWSER",
  HTML_FROM_PAGE: "HTML_FROM_PAGE",
  EXTRACT_TEXT_FROM_ELEMENT: "EXTRACT_TEXT_FROM_ELEMENT",
} as const;

export const WorkflowNodeInputTypes = {
  STRING: "STRING",
  BROWSER_INSTANCE: "BROWSER_INSTANCE",
} as const;

export const ColorForWorkflowNodeHandle: Record<keyof typeof WorkflowNodeInputTypes, string> = {
  STRING: "!bg-amber-400",
  BROWSER_INSTANCE: "!bg-sky-400",
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
    ],
    outputs: [
      {
        type: WorkflowNodeInputTypes.BROWSER_INSTANCE,
        label: "Web Page",
      }
    ]
  },
  HTML_FROM_PAGE: {
    isEntryPoint: false,
    label: "Get HTML from page",
    icon: CodeIcon,
    inputs: [
      {
        type: WorkflowNodeInputTypes.BROWSER_INSTANCE,
        label: "Web Page",
        required: true,
        hideHandle: false
      }
    ],
    outputs: [
      {
        type: WorkflowNodeInputTypes.STRING,
        label: "Html",
      },
      {
        type: WorkflowNodeInputTypes.BROWSER_INSTANCE,
        label: "Web Page",
      }
    ]
  },
  EXTRACT_TEXT_FROM_ELEMENT: {
    isEntryPoint: false,
    label: "Extract text from element",
    icon: TextIcon,
    inputs: [
      {
        type: WorkflowNodeInputTypes.STRING,
        label: "Html",
        required: true,
        hideHandle: false,
        variant: "textarea"
      },
      {
        type: WorkflowNodeInputTypes.STRING,
        label: "Selector",
        required: true,
        hideHandle: false
      },
    ],
    outputs: [
      {
        type: WorkflowNodeInputTypes.STRING,
        label: "Extracted text",
      },
    ]
  }
};