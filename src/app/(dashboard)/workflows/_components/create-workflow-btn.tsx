"use client";

import { useDialog } from "@/components/providers/dialog-provider";
import Button from "@/components/ui/button";
import { memo } from "react";
import CreateWorkflowForm from "./create-workflow-form";

export default memo(
  function CreateWorkflowBtn() {
    const { openDialog, closeDialog } = useDialog();
  
    return (
      <Button onClick={() => openDialog({
        title: "Create workflow",
        description: "Start building your workflow",
        content: <CreateWorkflowForm onSuccess={closeDialog} />
      })}>Create workflow</Button>
    )
  }
)