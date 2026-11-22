import { CheckIcon, TrophyIcon } from 'lucide-react';
import { cn } from '@/lib';
import type { PhaseStep } from '../hooks';

type PhaseStepperProps = {
  steps: PhaseStep[];
};

export const PhaseStepper = ({ steps }: PhaseStepperProps) => {
  if (steps.length === 0) return null;

  return (
    <div className={'flex items-start overflow-x-auto px-1 py-1'}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={
            'relative flex min-w-[84px] flex-1 flex-col items-center gap-1.5'
          }
        >
          {index > 0 && (
            <span
              className={cn(
                'absolute top-3 right-1/2 h-0.5 w-full',
                step.state === 'done' || step.state === 'crowned'
                  ? 'bg-success'
                  : 'bg-border-strong',
              )}
            />
          )}

          <span
            className={cn(
              'relative z-10 flex size-[26px] items-center justify-center rounded-full border-2 font-mono font-semibold text-[11px]',
              step.state === 'pending' &&
                'border-border-strong bg-card text-muted-foreground',
              step.state === 'now' &&
                'border-accent bg-accent text-accent-foreground ring-4 ring-accent-surface',
              step.state === 'done' && 'border-success bg-success text-white',
              step.state === 'crowned' && 'border-value bg-value text-white',
            )}
          >
            {step.state === 'done' && <CheckIcon className={'size-3.5'} />}
            {step.state === 'crowned' && <TrophyIcon className={'size-3.5'} />}
            {(step.state === 'now' || step.state === 'pending') && index + 1}
          </span>

          <span
            className={cn(
              'text-center text-[11.5px] font-semibold',
              step.state === 'now' && 'text-foreground',
              step.state === 'done' && 'text-success',
              step.state === 'crowned' && 'text-value',
              step.state === 'pending' && 'text-muted-foreground',
            )}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};
