import { useUrlSorting } from '@/hooks';
import { useTeamFilters } from './use-team-filters';
import { useTeams } from './use-teams';

const PAGE_SIZE = 10;

export const useTeamsScreen = () => {
  const {
    filters: { name, leagueId, page, sortBy, sortOrder },
    setFilters,
  } = useTeamFilters();

  const { data, isPending, isError, error } = useTeams({
    name: name || undefined,
    leagueId: leagueId || undefined,
    page,
    pageSize: PAGE_SIZE,
    sortBy,
    sortOrder,
  });

  const { sorting, onSortingChange } = useUrlSorting({
    sortBy,
    sortOrder,
    onSortingChange: ({ sortBy, sortOrder }) =>
      setFilters({ sortBy, sortOrder, page: 1 }),
  });

  return {
    teams: data?.data ?? [],
    sorting,
    onSortingChange,
    setFilters,
    isPending,
    isError,
    error,
    data,
  };
};
