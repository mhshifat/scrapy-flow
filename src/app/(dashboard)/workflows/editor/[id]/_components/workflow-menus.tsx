import Accordion from "@/components/ui/accordion";
import WorkflowBtn from "./workflow-btn";
import { WorkflowNodeTypes } from "./constants";

export default function WorkflowMenus() {
  return (
    <aside className="w-[320px] h-full border-r border-foreground/10">
      <Accordion>
        <Accordion.Item>
          <Accordion.Trigger>Data Extraction</Accordion.Trigger>
          <Accordion.Body>
            <WorkflowBtn type={WorkflowNodeTypes.HTML_FROM_PAGE} />
            <WorkflowBtn type={WorkflowNodeTypes.EXTRACT_TEXT_FROM_ELEMENT} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </aside>
  )
}