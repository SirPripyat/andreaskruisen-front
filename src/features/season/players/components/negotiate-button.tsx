import { HandshakeIcon } from 'lucide-react';
import { Button } from '@/components/ui';
import { useSelectedSeason } from '@/features/admin/seasons';
import { useMe } from '@/features/auth';
import { CreateNegotiationDrawer } from '@/features/season/negotiations';

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
    <CreateNegotiationDrawer
      seasonId={selectedSeason?.id}
      outgoingPlayerId={isMyTeam ? playerId : undefined}
      targetTeamId={isMyTeam ? undefined : teamId}
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
