"use client";

import { formatDistanceToNow } from 'date-fns';
import { CalendarIcon, CircleCheckIcon, CircleDashedIcon, CircleXIcon, ClockIcon, Loader2Icon, WorkflowIcon } from 'lucide-react';
import { WorkflowExecutionStatus, WorkflowPhaseOperationStatus } from '@/app/(dashboard)/workflows/editor/[id]/_components/helpers';
import useLiveExecutionWithPhases from './use-live-execution-with-phases';
import Button from '@/components/ui/button';
import { getTimeDuration } from '@/utils/date';
import { memo, useEffect } from 'react';

interface ExecutionSidebarProps {
  executionId?: string;
  workflowId?: string;
  selectedPhase: string | null;
  onSelectPhase: (phaseId: string) => void;
}

export default memo(
  function ExecutionSidebar({ executionId, workflowId, selectedPhase, onSelectPhase }: ExecutionSidebarProps) {
    const { data: execution } = useLiveExecutionWithPhases({
      id: executionId || "",
      workflowId: workflowId || ""
    });

    useEffect(() => {
      if (!execution) return;
      const sortedByCompleted = execution?.phases.toSorted((a, b) => b.completedAt! > a.completedAt! ? -1 : 1);
      onSelectPhase(sortedByCompleted?.[0].id);
    }, [execution])

    const isRunning = execution?.status === WorkflowExecutionStatus.RUNNING;
    const duration = getTimeDuration(execution?.startedAt, execution?.completedAt);
    return (
      <aside className='max-w-[440px] w-full border-r border-foreground/10 h-full shrink-0'>
        <ul className='p-0 m-0 list-none py-2'>
          <li className='flex items-center justify-between px-5 py-2'>
            <div className='flex items-center gap-2'>
              <CircleDashedIcon className='size-4 text-foreground/60' />
              <span className='text-sm text-foreground/60'>Status</span>
            </div>
  
            <span className='uppercase font-semibold'>{execution?.status}</span>
          </li>
          <li className='flex items-center justify-between px-5 py-1'>
            <div className='flex items-center gap-2'>
              <CalendarIcon className='size-4 text-foreground/60' />
              <span className='text-sm text-foreground/60'>Started at</span>
            </div>
  
            <span className='lowercase font-semibold'>{execution?.startedAt ? formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true }) : "-"}</span>
          </li>
          <li className='flex items-center justify-between px-5 py-1'>
            <div className='flex items-center gap-2'>
              <ClockIcon className='size-4 text-foreground/60' />
              <span className='text-sm text-foreground/60'>Duration</span>
            </div>
  
            <span className='lowercase font-semibold'>{duration || <Loader2Icon className='size-4 text-foreground/60 animate-spin' />}</span>
          </li>
        </ul>
        <div className='border-t border-b border-foreground/10 flex items-center justify-center py-2 px-4 gap-2'>
          <WorkflowIcon className='size-4' />
          <span className='font-semibold'>Phases</span>
        </div>
        <div className='flex flex-col py-2 px-2'>
          {execution?.phases.map(((phase, idx) => (
            <Button key={phase.id} variant={selectedPhase === phase.id ? "default" : 'ghost'} className='justify-start gap-2 py-2' onClick={() => !isRunning && onSelectPhase(phase.id)}>
              <span>{idx + 1}</span>
              <span>{phase.name}</span>
  
              <span className='ml-auto uppercase text-xs text-foreground/60'>{
                phase.status === WorkflowPhaseOperationStatus.COMPLETED 
                  ? <CircleCheckIcon className='start-4 text-success' />
                  : phase.status === WorkflowPhaseOperationStatus.FAILED
                  ? <CircleXIcon className='start-4 text-danger' />
                  : <CircleDashedIcon className='start-4 text-foreground/60' />
              }</span>
            </Button>
          )))}
        </div>
      </aside>
    )
  }
)