import { useUrlSorting } from '@/hooks';
import { useClubs } from './use-clubs';
import { useClubsFilters } from './use-clubs-filters';

const PAGE_SIZE = 10;

export const useClubsScreen = () => {
  const {
    filters: { name, leagueId, page, sortBy, sortOrder },
    setFilters,
  } = useClubsFilters();

  const { data, isPending, isError, error } = useClubs({
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
    clubs: data?.data ?? [],
    sorting,
    onSortingChange,
    setFilters,
    isPending,
    isError,
    error,
    data,
  };
};
