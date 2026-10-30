import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';
import { useDebouncedSearch, useUrlSorting } from '@/hooks';
import type { SortOrder } from '@/lib';
import type { PlayerSortField } from '../api';
import { usePlayers } from './use-players';

const PAGE_SIZE = 10;

export const usePlayersScreen = () => {
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

  const { data, isPending, isError, error } = usePlayers({
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
