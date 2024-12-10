import { FormProvider, useForm } from "react-hook-form"
import { createWorkflowSchema, ICreateWorkflowFormValues } from "./validations"
import { zodResolver } from "@hookform/resolvers/zod"
import Form from "@/components/ui/form"
import Label from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Button from "@/components/ui/button"
import { useCreateWorkflowMutation } from "./hooks/useCreateWorkflowMutation"
import { useRouter } from "next/navigation"

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
          createWorkflow.mutateAsync(values as ICreateWorkflowFormValues)
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