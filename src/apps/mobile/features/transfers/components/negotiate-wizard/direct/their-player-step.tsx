import { Button } from '@/components/ui';
import { PlayerPickerList } from '../player-picker-list';
import { togglePlayerId } from '../toggle-player-id';
import type { useDirectNegotiationWizard } from './use-direct-negotiation-wizard';

type TheirPlayerStepProps = {
  wizard: ReturnType<typeof useDirectNegotiationWizard>;
};

export const TheirPlayerStep = ({ wizard }: TheirPlayerStepProps) => {
  const {
    targetRoster,
    isTargetRosterPending,
    targetTeam,
    targetSquad,
    incomingPlayerIds,
    setValue,
    isIncomingLocked,
    goNext,
    goToStep,
  } = wizard;

  if (!targetSquad) {
    return (
      <div className={'flex flex-col gap-3'}>
        <div
          className={
            'rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm'
          }
        >
          {'Volte ao passo 1 e escolha um adversário primeiro.'}
        </div>
        <Button
          type={'button'}
          variant={'outline'}
          size={'sm'}
          onClick={() => goToStep('opponent')}
        >
          {'Escolher adversário'}
        </Button>
      </div>
    );
  }

  return (
    <div className={'flex flex-col gap-3'}>
      <p className={'text-muted-foreground text-xs'}>
        {`Escolha até 2 jogadores que você quer receber de ${targetTeam?.name ?? targetSquad.team.name}. Opcional — dá pra propor só por moedas.`}
      </p>

      <PlayerPickerList
        roster={targetRoster}
        isRosterPending={isTargetRosterPending}
        hasTeam={Boolean(targetTeam)}
        noTeamMessage={'Carregando elenco...'}
        selectedIds={incomingPlayerIds}
        onSelect={(playerId) =>
          !isIncomingLocked &&
          setValue(
            'incomingPlayerIds',
            togglePlayerId(incomingPlayerIds, playerId),
          )
        }
      />

      {!isIncomingLocked &&
        (incomingPlayerIds.length > 0 ? (
          <Button
            type={'button'}
            variant={'ghost'}
            size={'sm'}
            className={'self-start underline'}
            onClick={() => setValue('incomingPlayerIds', [])}
          >
            {'Remover seleção'}
          </Button>
        ) : (
          <Button
            type={'button'}
            variant={'ghost'}
            size={'sm'}
            className={'self-start underline'}
            onClick={goNext}
          >
            {'Pular essa etapa'}
          </Button>
        ))}
    </div>
  );
};
