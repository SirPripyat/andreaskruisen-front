import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';
import type { PlayerSortField } from '@/features/admin/players';
import { useDebouncedSearch, useUrlSorting } from '@/hooks';
import type { SortOrder } from '@/lib';
import { useSeasonPlayers } from './use-players';

const PAGE_SIZE = 10;

export const useSeasonPlayersScreen = () => {
  const [{ name, page, sortBy, sortOrder }, setFilters] = useQueryStates({
    name: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    sortBy: parseAsStringEnum<PlayerSortField>([
      'name',
      'overallRating',
    ]).withDefault('overallRating'),
    sortOrder: parseAsStringEnum<SortOrder>(['asc', 'desc']).withDefault(
      'desc',
    ),
  });

  const [draftName, setDraftName] = useDebouncedSearch(name, (value) => {
    setFilters({ name: value || null, page: 1 });
  });

  const { data, isPending, isError, error } = useSeasonPlayers({
    name: name || undefined,
    page,
    pageSize: PAGE_SIZE,
    sortBy,
    sortOrder,
  });

  const players = data?.data ?? [];

  const { sorting, onSortingChange } = useUrlSorting({
    sortBy,
    sortOrder,
    onSortingChange: ({ sortBy, sortOrder }) =>
      setFilters({ sortBy, sortOrder, page: 1 }),
  });

  return {
    players,
    sorting,
    onSortingChange,
    setFilters,
    draftName,
    setDraftName,
    isPending,
    isError,
    error,
    data,
  };
};
