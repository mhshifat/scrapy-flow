import { z } from "zod";

export const createWorkflowSchema = z.object({
  title: z.string().max(50),
  description: z.string().max(180).optional(),
  status: z.string().optional(),
});

export type ICreateWorkflowFormValues = z.infer<typeof createWorkflowSchema>;