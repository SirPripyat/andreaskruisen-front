import { useNegotiationWindowStatus } from '@/features/admin/negotiation-window';
import { useSelectedSeason } from '@/features/admin/seasons';
import { useMe } from '@/features/auth';

export const useTransfersScreen = () => {
  const { selectedSeason } = useSelectedSeason();

  const { data: me } = useMe();
  const { data: windowStatus, isPending: isWindowStatusPending } =
    useNegotiationWindowStatus();

  const myTeamId = me?.teamId ?? undefined;

  const isWindowClosed = !isWindowStatusPending && !windowStatus?.open;

  return {
    selectedSeason,
    myTeamId,
    windowStatus,
    isWindowClosed,
    isWindowStatusPending,
  };
};
