import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib';
import type { StepperStep } from './stepper';

type StepStatus = 'upcoming' | 'active' | 'done';

const STEP_BADGE_STYLES: Record<StepStatus, string> = {
  upcoming: 'bg-border-strong text-surface',
  active: 'bg-accent text-accent-foreground',
  done: 'bg-success text-white',
};

const getStepStatus = (isActive: boolean, isDone: boolean): StepStatus => {
  if (isActive) return 'active';
  if (isDone) return 'done';
  return 'upcoming';
};

type StepItemProps<TStepId extends string> = {
  step: StepperStep<TStepId>;
  currentStepId: TStepId;
  isStepDone: (stepId: TStepId) => boolean;
  isStepUnlocked: (stepIndex: number) => boolean;
  onStepClick: (stepId: TStepId) => void;
  index: number;
};

export const StepItem = <TStepId extends string>({
  step,
  currentStepId,
  isStepDone,
  isStepUnlocked,
  onStepClick,
  index,
}: StepItemProps<TStepId>) => {
  const isActive = step.id === currentStepId;
  const status = getStepStatus(isActive, isStepDone(step.id));
  const isUnlocked = isStepUnlocked(index);

  return (
    <button
      type={'button'}
      disabled={!isUnlocked}
      onClick={() => onStepClick(step.id)}
      className={cn(
        'flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 font-medium text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        isActive
          ? 'bg-surface text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <span
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded-full font-mono text-[10px]',
          STEP_BADGE_STYLES[status],
        )}
      >
        {status === 'done' ? <CheckIcon className={'size-2.5'} /> : index + 1}
      </span>
      <span className={'hidden sm:inline'}>{step.label}</span>
    </button>
  );
};
