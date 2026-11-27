import { HandshakeIcon } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { Button } from '@/components/ui';
import { useSelectedSeason } from '@/features/admin/seasons';
import { useMe } from '@/features/auth';
import { useSeasonSquads } from '@/features/season/squads';
import { useIsMobile } from '@/hooks';
import { NegotiateDrawer } from '@/shared/features/transfers';

const MobileDirectNegotiationWizard = lazy(() =>
  import('@/apps/mobile/features/transfers').then((module) => ({
    default: module.DirectNegotiationWizard,
  })),
);
const MobileCpuTransferWizard = lazy(() =>
  import('@/apps/mobile/features/transfers').then((module) => ({
    default: module.CpuTransferWizard,
  })),
);

type NegotiateButtonProps = {
  playerId: string;
  teamId: string;
  compact?: boolean;
  fullWidth?: boolean;
};

export const NegotiateButton = ({
  playerId,
  teamId,
  compact = false,
  fullWidth = false,
}: NegotiateButtonProps) => {
  const { selectedSeason } = useSelectedSeason();
  const { data: me } = useMe();
  const { data: squads } = useSeasonSquads();
  const isMobile = useIsMobile();

  const isMyTeam = me?.teamId === teamId;
  // Time sem Squad na temporada é CPU — negociação direta com ele sempre
  // 404a (ver ProposeNegotiationUseCase), então o botão já abre no modo de
  // troca instantânea.
  const isCounterpartCpu =
    !isMyTeam && !squads?.some((squad) => squad.team.id === teamId);

  const trigger = compact ? (
    <Button
      variant={'ghost'}
      size={'icon-sm'}
      aria-label={'Negociar'}
      disabled={!selectedSeason?.id}
    >
      <HandshakeIcon />
    </Button>
  ) : (
    <Button
      variant={fullWidth ? 'default' : 'outline'}
      className={fullWidth ? 'w-full' : undefined}
      disabled={!selectedSeason?.id}
    >
      <HandshakeIcon />
      {'Negociar'}
    </Button>
  );

  if (isMobile) {
    return (
      <Suspense fallback={null}>
        {isCounterpartCpu ? (
          <MobileCpuTransferWizard
            seasonId={selectedSeason?.id}
            incomingTeamId={isMyTeam ? undefined : teamId}
            outgoingPlayerId={isMyTeam ? playerId : undefined}
            incomingPlayerId={isMyTeam ? undefined : playerId}
            trigger={trigger}
          />
        ) : (
          <MobileDirectNegotiationWizard
            seasonId={selectedSeason?.id}
            targetTeamId={isMyTeam ? undefined : teamId}
            outgoingPlayerId={isMyTeam ? playerId : undefined}
            incomingPlayerId={isMyTeam ? undefined : playerId}
            trigger={trigger}
          />
        )}
      </Suspense>
    );
  }

  return (
    <NegotiateDrawer
      seasonId={selectedSeason?.id}
      initialMode={isCounterpartCpu ? 'cpu' : 'direct'}
      myPlayerId={isMyTeam ? playerId : undefined}
      counterpartTeamId={isMyTeam ? undefined : teamId}
      counterpartPlayerId={isMyTeam ? undefined : playerId}
      trigger={trigger}
    />
  );
};
