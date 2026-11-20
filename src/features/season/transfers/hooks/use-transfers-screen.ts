import { useNegotiationWindowStatus } from '@/features/admin/negotiation-window';
import { useSelectedSeason } from '@/features/admin/seasons';
import { useMe } from '@/features/auth';
import { useNegotiations } from '@/features/season/negotiations';
import { useTransfers } from './use-transfers';

export const useTransfersScreen = () => {
  const { selectedSeason } = useSelectedSeason();

  const { data: me } = useMe();
  const { data: windowStatus, isPending: isWindowStatusPending } =
    useNegotiationWindowStatus();
  const { data: transfers } = useTransfers();
  const { data: received } = useNegotiations({ direction: 'received' });
  const { data: sent } = useNegotiations({ direction: 'sent' });

  const myTeamId = me?.teamId ?? undefined;

  const isWindowClosed = !isWindowStatusPending && !windowStatus?.open;

  return {
    selectedSeason,
    myTeamId,
    windowStatus,
    isWindowClosed,
    isWindowStatusPending,
    timelineCount: transfers?.length ?? 0,
    negotiationsCount: (received?.length ?? 0) + (sent?.length ?? 0),
  };
};
