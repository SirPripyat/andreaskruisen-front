import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';
import { useAllLeagues } from '@/features/admin/leagues';
import {
  ALL_LEAGUES,
  type ClubSortField,
  useClubsInfinite,
} from '@/features/season/clubs';
import { useDebouncedSearch } from '@/hooks';
import type { SortOrder } from '@/lib';
import type { ClubsFilterValues } from '../components';

const PAGE_SIZE = 10;

const sortByDefault = parseAsStringEnum<ClubSortField>([
  'name',
  'averageOverallRating',
  'averageDefenseRating',
  'averageMidfieldRating',
  'averageAttackRating',
]).withDefault('averageOverallRating');

export const useMobileClubsScreen = () => {
  const [{ name, leagueId, sortBy, sortOrder }, setFilters] = useQueryStates({
    name: parseAsString.withDefault(''),
    leagueId: parseAsString.withDefault(''),
    sortBy: sortByDefault,
    sortOrder: parseAsStringEnum<SortOrder>(['asc', 'desc']).withDefault(
      'desc',
    ),
  });

  const [draftName, setDraftName] = useDebouncedSearch(name, (value) => {
    setFilters({ name: value || null });
  });

  const { data: leagues } = useAllLeagues();

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useClubsInfinite({
    name: name || undefined,
    leagueId: leagueId || undefined,
    pageSize: PAGE_SIZE,
    sortBy,
    sortOrder,
  });

  const clubs = data?.pages.flatMap((page) => page.data) ?? [];
  const total = data?.pages[0]?.total;

  const activeFilterCount =
    (leagueId ? 1 : 0) +
    (sortBy !== 'averageOverallRating' || sortOrder !== 'desc' ? 1 : 0);

  const applyFilters = (values: ClubsFilterValues) => {
    setFilters({
      leagueId:
        (values.leagueId === ALL_LEAGUES ? '' : values.leagueId) || null,
      sortBy: values.sortBy,
      sortOrder: values.sortOrder,
    });
  };

  const clearFilters = () => {
    setDraftName('');
    setFilters({ name: null, leagueId: null, sortBy: null, sortOrder: null });
  };

  return {
    clubs,
    total,
    draftName,
    setDraftName,
    leagueId,
    leagues: leagues ?? [],
    sortBy,
    sortOrder,
    activeFilterCount,
    applyFilters,
    clearFilters,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
