import { PlayerPickerList } from '../player-picker-list';
import { togglePlayerId } from '../toggle-player-id';
import type { useCpuTransferWizard } from './use-cpu-transfer-wizard';

type OutgoingStepProps = {
  wizard: ReturnType<typeof useCpuTransferWizard>;
};

export const OutgoingStep = ({ wizard }: OutgoingStepProps) => {
  const {
    myRoster,
    isMyRosterPending,
    myTeam,
    outgoingPlayerIds,
    setValue,
    isOutgoingLocked,
  } = wizard;

  return (
    <div className={'flex flex-col gap-3'}>
      <p className={'text-muted-foreground text-xs'}>
        {`Escolha até 2 jogadores que saem do ${myTeam?.name ?? 'seu time'} nessa troca.`}
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
    </div>
  );
};
