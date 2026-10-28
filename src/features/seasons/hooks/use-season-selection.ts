import { useSeasonStore } from '@/stores';
import { useSeasons } from './use-seasons';
import { useSelectSeason } from './use-select-season';
import { useSelectedSeason } from './use-selected-season';

/**
 * Lists every season and resolves the currently selected one, exposing a
 * single `selectSeasonId` that both the header switcher and the seasons
 * screen use to change it (writes the local store and syncs the backend
 * default via `POST /seasons/:id/select`).
 */
export function useSeasonSelection() {
  const { data: seasons, isPending: isSeasonsPending } = useSeasons();
  const { selectedSeason, isPending: isSelectedPending } = useSelectedSeason();
  const setSelectedSeasonId = useSeasonStore(
    (state) => state.setSelectedSeasonId,
  );
  const { mutate: selectSeason } = useSelectSeason();

  function selectSeasonId(seasonId: string) {
    setSelectedSeasonId(seasonId);
    selectSeason(seasonId);
  }

  return {
    seasons: seasons ?? [],
    selectedSeason,
    isPending: isSeasonsPending || isSelectedPending,
    selectSeasonId,
  };
}
