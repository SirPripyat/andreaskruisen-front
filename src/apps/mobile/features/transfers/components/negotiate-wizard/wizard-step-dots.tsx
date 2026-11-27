import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib';

type WizardStep<TStepId extends string> = { id: TStepId; label: string };

type WizardStepDotsProps<TStepId extends string> = {
  steps: readonly WizardStep<TStepId>[];
  currentStepId: TStepId;
  isStepDone: (stepId: TStepId) => boolean;
  isStepUnlocked: (stepIndex: number) => boolean;
  onStepClick: (stepId: TStepId) => void;
};

// Stepper (src/components/stepper) esconde o rótulo abaixo de sm — no
// mobile isso zera o texto sempre, então essa versão mantém o rótulo
// visível (igual ao mockup) em vez de reusar aquele componente.
export const WizardStepDots = <TStepId extends string>({
  steps,
  currentStepId,
  isStepDone,
  isStepUnlocked,
  onStepClick,
}: WizardStepDotsProps<TStepId>) => {
  return (
    <nav
      aria-label={'Passos da negociação'}
      className={'flex shrink-0 gap-0.5 border-b px-2 py-2'}
    >
      {steps.map((step, index) => {
        const isActive = step.id === currentStepId;
        const done = isStepDone(step.id);
        const unlocked = isStepUnlocked(index);

        return (
          <button
            key={step.id}
            type={'button'}
            disabled={!unlocked}
            onClick={() => onStepClick(step.id)}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 rounded-lg py-1 text-center disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            <span
              className={cn(
                'flex size-6 items-center justify-center rounded-full border-2 font-mono text-[11px] font-bold',
                done
                  ? 'border-success bg-success text-white'
                  : isActive
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border-strong bg-background text-muted-foreground',
              )}
            >
              {done ? <CheckIcon className={'size-3'} /> : index + 1}
            </span>
            <span
              className={cn(
                'text-[10px] leading-tight',
                isActive
                  ? 'font-semibold text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {step.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
