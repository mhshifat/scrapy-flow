"use server";

import { unstable_noStore } from "next/cache";
import db from "@/lib/db";
import { createWorkflowSchema } from './../app/(dashboard)/workflows/_components/validations';
import { Workflow } from "@prisma/client";
import { WorkflowStatus } from "@/app/(dashboard)/workflows/_components/constants";
import { getNodeDetails, WorkflowExecutionStatus, WorkflowExecutionTriggerType, WorkflowNode, WorkflowPhaseOperationStatus } from "@/app/(dashboard)/workflows/editor/[id]/_components/helpers";
import { IWorkflowPhase } from "@/app/(dashboard)/workflows/editor/[id]/_components/workflow-header";
import { Browser, Page } from "puppeteer";
import { WorkflowNodeInputTypes } from "@/app/(dashboard)/workflows/editor/[id]/_components/constants";
import { EnvironmentExecutorState, extractTextFromElementExecutor, htmlFromPageExecutor, launchBrowserExecutor } from "./workflow-srv";
import { Edge } from "@xyflow/react";

export async function getWorkflows() {
  unstable_noStore();

  return db.workflow.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })
}

type CreateWorkflowPayload = Pick<Workflow, "title" | "description" | "definition" | "status">;

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

export async function runWorkflowPlan(id: string, phases: string) {
  const plan = JSON.parse(phases) as IWorkflowPhase[];
  const workflow = await db.workflow.findUnique({ where: { id } });
  if (!workflow) throw new Error("Workflow not found");
  const execution = await db.workflowExecution.create({
    data: {
      workflowId: id,
      trigger: WorkflowExecutionTriggerType.MANUAL,
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
      phases: {
        create: plan.flatMap(phase => {
          return phase.nodes.flatMap(node => {
            return {
              status: WorkflowPhaseOperationStatus.RUNNING,
              startedAt: new Date(),
              name: getNodeDetails(node.data.type).label,
              node: JSON.stringify(node),
              phase: phase.phase,
            }
          })
        })
      }
    }
  })
  executeWorkflow(execution.id).catch(console.error);
  return execution;
}

interface WorkflowExecutionEnvironment {
  browser?: Browser;
  page?: Page;
  phases: Record<string, {
    inputs: Record<string, string>;
    outputs: Record<string, string>;
  }>
}

export async function executeWorkflow(executionId: string) {
  const execution = await db.workflowExecution.findUnique({ where: { id: executionId }, include: { phases: true, workflow: true } });
  if (!execution || !execution.id) throw new Error("Execution not found");
  
  await db.workflow.update({
    where: {
      id: execution.workflow.id,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: execution.id
    }
  })

  const environment: WorkflowExecutionEnvironment = {
    phases: {}
  }
  let finalExecutionStatus = WorkflowExecutionStatus.COMPLETED;
  for (const phase of execution.phases) {
    const result = await executeWorkflowPhase(phase.id, (JSON.parse(execution.workflow.definition)?.edges || []) as Edge[], environment);
    if (!result.success) {
      finalExecutionStatus = WorkflowExecutionStatus.FAILED;
      break;
    }
  }

  if (environment.browser) await environment.browser.close().catch(err => console.error("Error closing the browser", err));
  await db.workflowExecution.update({
    where: {
      id: execution.id
    },
    data: {
      completedAt: new Date(),
      status: finalExecutionStatus,
      workflow: {
        update: {
          where: {
            id: execution.workflow.id,
            lastRunId: execution.id,
          },
          data: {
            lastRunStatus: finalExecutionStatus,
            lastRunId: execution.id
          }
        }
      }
    },
  });
}

const PhaseRegistry = {
  LAUNCH_BROWSER: launchBrowserExecutor,
  HTML_FROM_PAGE: htmlFromPageExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementExecutor,
} as const;

export async function executeWorkflowPhase(phaseId: string, edges: Edge[], environment: WorkflowExecutionEnvironment) {
  try {
    const phase = await db.workflowPhaseOperation.findUnique({ where: { id: phaseId } });
    if (!phase) throw new Error("Phase not found");
    const node = JSON.parse(phase.node) as WorkflowNode;
    environment.phases[node.id] = {
      inputs: {},
      outputs: {},
    };
    const nodeDetails = getNodeDetails(node.data.type);
    for (const input of nodeDetails.inputs) {
      if (input.type === WorkflowNodeInputTypes.BROWSER_INSTANCE) continue;
      const inputName = input.label;
      const inputVal = node.data.inputs[inputName];

      if (inputVal) {
        environment.phases[node.id].inputs[inputName] = inputVal;
        continue;
      }

      const connectedEdge = edges.find(edge => edge.target === node.id && edge.targetHandle === input.label);
      if (!connectedEdge) continue;
      environment.phases[node.id].inputs[input.label] = environment.phases[connectedEdge.source].outputs[connectedEdge.sourceHandle!];
    }
    await db.workflowPhaseOperation.update({
      where: { id: phaseId },
      data: {
        startedAt: new Date(),
        inputs: JSON.stringify(environment.phases[node.id].inputs)
      }
    });
    const executorFn = PhaseRegistry[node.data.type];
    if (!executorFn) throw new Error("Phase executor function not found");
    const executorState: EnvironmentExecutorState<any> = {
      getInput: (name: string) => environment.phases[node.id].inputs[name],
      setOutput: (name: string, value: string) => (environment.phases[node.id].outputs[name] = value),

      getBrowser: () => environment.browser,
      setBrowser: (browser) => (environment.browser = browser),

      getPage: () => environment.page,
      setPage: (page) => (environment.page = page),
    } 
    await executorFn(executorState);

    await db.workflowPhaseOperation.update({
      where: { id: phaseId },
      data: {
        completedAt: new Date(),
        status: WorkflowPhaseOperationStatus.COMPLETED,
        outputs: JSON.stringify(environment.phases[node.id].outputs)
      }
    });
    return { success: true }
  } catch (err) {
    await db.workflowPhaseOperation.update({
      where: { id: phaseId },
      data: {
        status: WorkflowPhaseOperationStatus.FAILED,
        logs: {
          create: {
            level: "error",
            message: (err as Error)?.message,
          }
        }
      }
    });
    return { success: false, message: (err as Error)?.message }
  }
}

export async function getWorkflowExecutionById(query: { id: string; workflowId: string }) {
  return db.workflowExecution.findUnique({
    where: {
      id: query.id,
      workflowId: query.workflowId
    },
    include: {
      phases: {
        orderBy: {
          phase: "asc"
        }
      }
    }
  })
}

export async function getWorkflowExecutionPhaseById(id: string) {
  return db.workflowPhaseOperation.findUnique({
    where: {
      id,
    },
    include: {
      logs: {
        orderBy: {
          timestamp: "asc"
        }
      }
    }
  })
}

export async function getWorkflowRuns(workflowId: string) {
  return db.workflowExecution.findMany({
    where: {
      workflowId
    }
  })
}