import { useAllLeagues } from '@/features/admin';
import { useDebouncedSearch } from '@/hooks';
import { ALL_LEAGUES } from '../constants';
import { useClubsFilters } from './use-clubs-filters';

export const useClubsDataFilters = () => {
  const { filters, setFilters } = useClubsFilters();
  const { data: leagues } = useAllLeagues();

  const [draftName, setDraftName] = useDebouncedSearch(
    filters.name,
    (value) => {
      setFilters({ name: value || null, page: 1 });
    },
  );

  const setLeagueId = (id: string) => {
    const leagueId = id === ALL_LEAGUES ? '' : id;

    setFilters({
      leagueId: leagueId || null,
      page: 1,
    });
  };

  const hasActiveFilters = Boolean(filters.name || filters.leagueId);

  const clearFilters = () => {
    setDraftName('');
    setFilters({ name: null, leagueId: null, page: 1 });
  };

  return {
    filters,
    setFilters,
    setLeagueId,
    draftName,
    setDraftName,
    leagues: leagues ?? [],
    hasActiveFilters,
    clearFilters,
  };
};
