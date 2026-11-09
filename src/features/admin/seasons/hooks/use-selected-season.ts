import { useMe } from '@/features/auth';
import { useActiveSeason } from './use-active-season';
import { useSeasons } from './use-seasons';

export const useSelectedSeason = () => {
  const { data: me, isPending: isMePending } = useMe();
  const selectedSeasonId = me?.selectedSeasonId ?? null;

  const { data: seasons, isPending: isSeasonsPending } = useSeasons();
  const { data: activeSeason, isPending: isActivePending } = useActiveSeason({
    enabled: !selectedSeasonId,
  });

  if (selectedSeasonId) {
    const selectedSeason =
      seasons?.find((season) => season.id === selectedSeasonId) ?? null;

    return {
      selectedSeason,
      isPending: isMePending || isSeasonsPending,
    };
  }

  return {
    selectedSeason: activeSeason ?? null,
    isPending: isMePending || isActivePending,
  };
};
