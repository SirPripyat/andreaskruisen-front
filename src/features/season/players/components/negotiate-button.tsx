import { HandshakeIcon } from 'lucide-react';
import { Button } from '@/components/ui';
import { useSelectedSeason } from '@/features/admin/seasons';
import { useMe } from '@/features/auth';
import { CreateTransferDrawer } from '@/features/season/transfers';

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

  const isMyTeam = me?.teamId === teamId;

  return (
    <CreateTransferDrawer
      seasonId={selectedSeason?.id}
      outgoingTeamId={isMyTeam ? teamId : undefined}
      outgoingPlayerId={isMyTeam ? playerId : undefined}
      incomingTeamId={isMyTeam ? undefined : teamId}
      incomingPlayerId={isMyTeam ? undefined : playerId}
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
