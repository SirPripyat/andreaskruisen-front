import { HandshakeIcon } from 'lucide-react';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { WizardShell } from '../wizard-shell';
import { WizardStepDots } from '../wizard-step-dots';
import { MyPlayerStep } from './my-player-step';
import { OpponentStep } from './opponent-step';
import { SendStep } from './send-step';
import { TheirPlayerStep } from './their-player-step';
import { TicketStep } from './ticket-step';
import {
  DIRECT_STEPS,
  useDirectNegotiationWizard,
} from './use-direct-negotiation-wizard';

type DirectNegotiationWizardProps = {
  seasonId: string | undefined;
  windowClosed?: boolean;
  trigger?: ReactElement;
  targetTeamId?: string;
  outgoingPlayerId?: string;
  incomingPlayerId?: string;
};

export const DirectNegotiationWizard = ({
  seasonId,
  windowClosed,
  trigger,
  targetTeamId,
  outgoingPlayerId,
  incomingPlayerId,
}: DirectNegotiationWizardProps) => {
  const [open, setOpen] = useState(false);

  const wizard = useDirectNegotiationWizard({
    open,
    initialTargetTeamId: targetTeamId,
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
    targetSquad,
  } = wizard;

  const footer =
    currentStep === 'send' ? undefined : (
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
          disabled={currentStep === 'opponent' && !targetSquad}
          className={'flex-1'}
        >
          {currentStep === 'ticket' ? 'Revisar' : 'Avançar'}
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
            <HandshakeIcon />
            {'Nova negociação'}
          </Button>
        )
      }
      title={'Negociar'}
      isFirstStep={isFirstStep}
      onBack={goBack}
      stepDots={
        <WizardStepDots
          steps={DIRECT_STEPS}
          currentStepId={currentStep}
          isStepDone={isStepDone}
          isStepUnlocked={isStepUnlocked}
          onStepClick={goToStep}
        />
      }
      footer={footer}
    >
      {currentStep === 'opponent' && <OpponentStep wizard={wizard} />}
      {currentStep === 'myPlayer' && <MyPlayerStep wizard={wizard} />}
      {currentStep === 'theirPlayer' && <TheirPlayerStep wizard={wizard} />}
      {currentStep === 'ticket' && <TicketStep wizard={wizard} />}
      {currentStep === 'send' && <SendStep wizard={wizard} />}
    </WizardShell>
  );
};
