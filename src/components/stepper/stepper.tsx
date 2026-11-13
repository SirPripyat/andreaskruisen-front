import { cn } from 'cn';
import { StepItem } from './step-item';

export type StepperStep<TStepId extends string> = {
  id: TStepId;
  label: string;
};

type StepperProps<TStepId extends string> = {
  steps: readonly StepperStep<TStepId>[];
  currentStepId: TStepId;
  isStepDone: (stepId: TStepId) => boolean;
  isStepUnlocked: (stepIndex: number) => boolean;
  onStepClick: (stepId: TStepId) => void;
  className?: string;
};

export const Stepper = <TStepId extends string>({
  steps,
  currentStepId,
  isStepDone,
  isStepUnlocked,
  onStepClick,
  className,
}: StepperProps<TStepId>) => (
  <nav
    className={cn(
      'flex gap-1 rounded-full border bg-background p-1',
      className,
    )}
  >
    {steps.map((step, index) => (
      <StepItem
        key={step.id}
        step={step}
        index={index}
        currentStepId={currentStepId}
        isStepDone={isStepDone}
        isStepUnlocked={isStepUnlocked}
        onStepClick={onStepClick}
      />
    ))}
  </nav>
);
