import { HandshakeIcon } from 'lucide-react';
import { Button } from '@/components/ui';
import { useSelectedSeason } from '@/features/admin/seasons';
import { useMe } from '@/features/auth';
import { useSeasonSquads } from '@/features/season/squads';
import { NegotiateDrawer } from '@/features/season/transfers';

type NegotiateButtonProps = {
  playerId: string;
  teamId: string;
  compact?: boolean;
};

export const NegotiateButton = ({
  playerId,
  teamId,
  compact = false,
}: NegotiateButtonProps) => {
  const { selectedSeason } = useSelectedSeason();
  const { data: me } = useMe();
  const { data: squads } = useSeasonSquads();

  const isMyTeam = me?.teamId === teamId;
  // Time sem Squad na temporada é CPU — negociação direta com ele sempre
  // 404a (ver ProposeNegotiationUseCase), então o botão já abre no modo de
  // troca instantânea.
  const isCounterpartCpu =
    !isMyTeam && !squads?.some((squad) => squad.team.id === teamId);

  return (
    <NegotiateDrawer
      seasonId={selectedSeason?.id}
      initialMode={isCounterpartCpu ? 'cpu' : 'direct'}
      myPlayerId={isMyTeam ? playerId : undefined}
      counterpartTeamId={isMyTeam ? undefined : teamId}
      counterpartPlayerId={isMyTeam ? undefined : playerId}
      trigger={
        compact ? (
          <Button
            variant={'ghost'}
            size={'icon-sm'}
            aria-label={'Negociar'}
            disabled={!selectedSeason?.id}
          >
            <HandshakeIcon />
          </Button>
        ) : (
          <Button variant={'outline'} disabled={!selectedSeason?.id}>
            <HandshakeIcon />
            {'Negociar'}
          </Button>
        )
      }
    />
  );
};
