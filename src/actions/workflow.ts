"use server";

import { unstable_noStore } from "next/cache";
import db from "@/lib/db";
import { waitFor } from "@/utils/helpers";
import { ICreateWorkflowFormValues } from "@/app/(dashboard)/workflows/_components/validations";
import { createWorkflowSchema } from './../app/(dashboard)/workflows/_components/validations';
import { Workflow } from "@prisma/client";

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