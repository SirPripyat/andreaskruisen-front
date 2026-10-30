import { useSeasonStore } from '@/stores';
import { useActiveSeason } from './use-active-season';
import { useSeasons } from './use-seasons';

/**
 * Resolves which season the app should currently operate on: the browser's
 * own choice (zustand, persisted to localStorage) wins when set, otherwise
 * it falls back to the season the backend has marked as active.
 */
export function useSelectedSeason() {
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
}
