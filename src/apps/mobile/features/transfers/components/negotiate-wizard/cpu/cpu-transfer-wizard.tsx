import { Cpu as CpuIcon } from 'lucide-react';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { WizardShell } from '../wizard-shell';
import { WizardStepDots } from '../wizard-step-dots';
import { ConfirmStep } from './confirm-step';
import { IncomingStep } from './incoming-step';
import { OutgoingStep } from './outgoing-step';
import { CPU_STEPS, useCpuTransferWizard } from './use-cpu-transfer-wizard';

type CpuTransferWizardProps = {
  seasonId: string | undefined;
  windowClosed?: boolean;
  trigger?: ReactElement;
  incomingTeamId?: string;
  outgoingPlayerId?: string;
  incomingPlayerId?: string;
};

export const CpuTransferWizard = ({
  seasonId,
  windowClosed,
  trigger,
  incomingTeamId,
  outgoingPlayerId,
  incomingPlayerId,
}: CpuTransferWizardProps) => {
  const [open, setOpen] = useState(false);

  const wizard = useCpuTransferWizard({
    open,
    initialIncomingTeamId: incomingTeamId,
    initialOutgoingPlayerId: outgoingPlayerId,
    initialIncomingPlayerId: incomingPlayerId,
  });

  const {
    currentStep,
    goToStep,
    goBack,
    goNext,
    isFirstStep,
    isStepDone,
    isStepUnlocked,
    incomingPlayerIds,
    outgoingPlayerIds,
  } = wizard;

  const footer =
    currentStep === 'confirm' ? undefined : (
      <>
        <Button
          type={'button'}
          variant={'ghost'}
          disabled={isFirstStep}
          onClick={goBack}
          className={'flex-1'}
        >
          {'Voltar'}
        </Button>
        <Button
          type={'button'}
          onClick={goNext}
          disabled={
            (currentStep === 'incoming' && incomingPlayerIds.length === 0) ||
            (currentStep === 'outgoing' && outgoingPlayerIds.length === 0)
          }
          className={'flex-1'}
        >
          {'Avançar'}
        </Button>
      </>
    );

  return (
    <WizardShell
      open={open}
      onOpenChange={setOpen}
      trigger={
        trigger ?? (
          <Button disabled={!seasonId || windowClosed}>
            <CpuIcon />
            {'Transferência de mercado'}
          </Button>
        )
      }
      title={'Transferência de mercado'}
      isFirstStep={isFirstStep}
      onBack={goBack}
      stepDots={
        <WizardStepDots
          steps={CPU_STEPS}
          currentStepId={currentStep}
          isStepDone={isStepDone}
          isStepUnlocked={isStepUnlocked}
          onStepClick={goToStep}
        />
      }
      footer={footer}
    >
      {currentStep === 'incoming' && <IncomingStep wizard={wizard} />}
      {currentStep === 'outgoing' && <OutgoingStep wizard={wizard} />}
      {currentStep === 'confirm' && <ConfirmStep wizard={wizard} />}
    </WizardShell>
  );
};
