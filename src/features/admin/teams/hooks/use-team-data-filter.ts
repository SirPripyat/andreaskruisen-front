import { useAllLeagues } from '@/features/admin/leagues';
import { useDebouncedSearch } from '@/hooks';
import { ALL_LEAGUES } from '../constants';
import { useTeamFilters } from './use-team-filters';

export const useTeamDataFilter = () => {
  const { filters, setFilters } = useTeamFilters();

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
