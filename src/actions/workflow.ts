"use server";

import { unstable_noStore } from "next/cache";
import db from "@/lib/db";
import { waitFor } from "@/utils/helpers";
import { createWorkflowSchema } from './../app/(dashboard)/workflows/_components/validations';
import { Workflow } from "@prisma/client";
import { WorkflowStatus } from "@/app/(dashboard)/workflows/_components/constants";

export async function getWorkflows() {
  unstable_noStore();

  await waitFor(5000);
  return db.workflow.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })
}

type CreateWorkflowPayload = Omit<Workflow, "id" | "createdAt" | "updatedAt">;

export async function createWorkflow(data: CreateWorkflowPayload) {
  await createWorkflowSchema.parseAsync(data);

  return db.workflow.create({
    data
  });
}

export async function updateWorkflowById(id: string, data: Partial<CreateWorkflowPayload>) {
  await createWorkflowSchema.partial().parseAsync(data);

  const workflow = await db.workflow.findUnique({
    where: {
      id
    }
  });

  if (workflow?.status !== WorkflowStatus.DRAFT) throw new Error("Cannot update active workflow");

  return db.workflow.update({
    where: { id },
    data
  });
}

export async function getWorkflowById(id: string) {
  return db.workflow.findUnique({
    where: {
      id
    }
  });
}