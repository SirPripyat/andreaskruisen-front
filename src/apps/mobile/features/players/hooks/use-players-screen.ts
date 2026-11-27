import { useInfiniteQuery } from '@tanstack/react-query';
import { parseAsString, useQueryStates } from 'nuqs';
import type { PlayersAdvancedFilters } from '@/features/admin/players';
import { useDebouncedSearch } from '@/hooks';
import { nullsToUndefined, queryKeys } from '@/lib';
import {
  ADVANCED_FILTER_PARSERS,
  listSeasonPlayers,
} from '@/shared/features/players';

const PAGE_SIZE = 10;

export const useMobilePlayersScreen = () => {
  const [{ name, ...advancedFilters }, setFilters] = useQueryStates({
    name: parseAsString.withDefault(''),
    ...ADVANCED_FILTER_PARSERS,
  });

  const [draftName, setDraftName] = useDebouncedSearch(name, (value) => {
    setFilters({ name: value || null });
  });

  const query = nullsToUndefined(advancedFilters);

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.seasonPlayers.infiniteList({
      name: name || undefined,
      pageSize: PAGE_SIZE,
      sortBy: 'overallRating',
      sortOrder: 'desc',
      ...query,
    }),
    queryFn: ({ pageParam }) =>
      listSeasonPlayers({
        name: name || undefined,
        page: pageParam,
        pageSize: PAGE_SIZE,
        sortBy: 'overallRating',
        sortOrder: 'desc',
        ...query,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const players = data?.pages.flatMap((page) => page.data) ?? [];
  const total = data?.pages[0]?.total;

  const activeAdvancedFilterCount = Object.values(advancedFilters).filter(
    (value) => value !== null && (!Array.isArray(value) || value.length > 0),
  ).length;

  const resetAdvancedFilters = () =>
    Object.fromEntries(
      Object.keys(ADVANCED_FILTER_PARSERS).map((key) => [key, null]),
    );

  const applyAdvancedFilters = (values: PlayersAdvancedFilters) => {
    setFilters({ ...resetAdvancedFilters(), ...values });
  };

  const clearAdvancedFilters = () => {
    setFilters(resetAdvancedFilters());
  };

  return {
    players,
    total,
    draftName,
    setDraftName,
    advancedFilters: query,
    activeAdvancedFilterCount,
    applyAdvancedFilters,
    clearAdvancedFilters,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
