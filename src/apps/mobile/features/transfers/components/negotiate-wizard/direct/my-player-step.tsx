import { Button } from '@/components/ui';
import { PlayerPickerList } from '../player-picker-list';
import { togglePlayerId } from '../toggle-player-id';
import type { useDirectNegotiationWizard } from './use-direct-negotiation-wizard';

type MyPlayerStepProps = {
  wizard: ReturnType<typeof useDirectNegotiationWizard>;
};

export const MyPlayerStep = ({ wizard }: MyPlayerStepProps) => {
  const {
    myRoster,
    isMyRosterPending,
    myTeam,
    outgoingPlayerIds,
    setValue,
    isOutgoingLocked,
    goNext,
  } = wizard;

  return (
    <div className={'flex flex-col gap-3'}>
      <p className={'text-muted-foreground text-xs'}>
        {`Escolha até 2 jogadores que saem na troca com ${myTeam?.name ?? 'seu time'}. Opcional — dá pra propor só por moedas.`}
      </p>

      <PlayerPickerList
        roster={myRoster}
        isRosterPending={isMyRosterPending}
        hasTeam={Boolean(myTeam)}
        noTeamMessage={'Carregando seu time...'}
        selectedIds={outgoingPlayerIds}
        onSelect={(playerId) =>
          !isOutgoingLocked &&
          setValue(
            'outgoingPlayerIds',
            togglePlayerId(outgoingPlayerIds, playerId),
          )
        }
      />

      {!isOutgoingLocked &&
        (outgoingPlayerIds.length > 0 ? (
          <Button
            type={'button'}
            variant={'ghost'}
            size={'sm'}
            className={'self-start underline'}
            onClick={() => setValue('outgoingPlayerIds', [])}
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
