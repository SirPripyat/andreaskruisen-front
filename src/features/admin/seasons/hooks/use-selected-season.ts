import { useSeasonStore } from '@/stores';
import { useActiveSeason } from './use-active-season';
import { useSeasons } from './use-seasons';

export const useSelectedSeason = () => {
  const selectedSeasonId = useSeasonStore((state) => state.selectedSeasonId);
  const { data: seasons, isPending: isSeasonsPending } = useSeasons();
  const { data: activeSeason, isPending: isActivePending } = useActiveSeason();

  const selectedSeason =
    seasons?.find((season) => season.id === selectedSeasonId) ??
    activeSeason ??
    null;

  return {
    selectedSeason,
    isPending: isSeasonsPending || isActivePending,
  };
};
