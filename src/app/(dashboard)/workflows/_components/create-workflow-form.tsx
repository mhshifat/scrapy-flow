import { FormProvider, useForm } from "react-hook-form"
import { createWorkflowSchema, ICreateWorkflowFormValues } from "./validations"
import { zodResolver } from "@hookform/resolvers/zod"
import Form from "@/components/ui/form"
import Label from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Button from "@/components/ui/button"
import { useCreateWorkflowMutation } from "./hooks/use-create-workflow-mutation"
import { useRouter } from "next/navigation"
import { createWorkflowNode } from "../editor/[id]/_components/helpers"
import { WorkflowNodeTypes } from "../editor/[id]/_components/constants"

interface CreateWorkflowFormProps {
  onSuccess?: () => void;
}

export default function CreateWorkflowForm({ onSuccess }: CreateWorkflowFormProps) {
  const router = useRouter();
  const createWorkflow = useCreateWorkflowMutation();
  const form = useForm<ICreateWorkflowFormValues>({
    defaultValues: {
      title: "",
      description: "",
    },
    resolver: zodResolver(createWorkflowSchema)
  })

  const loading = createWorkflow.isPending;

  return (
    <FormProvider {...form}>
      <Form
        disabled={loading}
        onSubmit={(values) => {
          createWorkflow.mutateAsync({
            ...values as ICreateWorkflowFormValues,
            definition: JSON.stringify({
              nodes: [createWorkflowNode(WorkflowNodeTypes.LAUNCH_BROWSER)],
              edges: [],
              viewport: {
                x: 0,
                y: 0,
                zoom: 1
              }
            })
          })
            .then((data) => {
              onSuccess?.();
              router.push(`/workflows/editor/${data.id}`);
            });
        }}
      >
        <Label
          required
          title="Name"
          error={form.formState.errors.title?.message}
        >
          <Input
            {...form.register("title")}
          />
        </Label>

        <Label
          title="Description"
          error={form.formState.errors.description?.message}
        >
          <Textarea
            {...form.register("description")}
          />
        </Label>

        <Button loading={loading} disabled={loading} className="mt-2" type="submit">Proceed</Button>
      </Form>
    </FormProvider>
  )
}