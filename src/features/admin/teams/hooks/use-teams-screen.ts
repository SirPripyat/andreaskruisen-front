import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';
import { useDebouncedSearch, useUrlSorting } from '@/hooks';
import type { SortOrder } from '@/lib';
import type { TeamSortField } from '../api';
import { useTeams } from './use-teams';

const PAGE_SIZE = 10;

export const useTeamsScreen = () => {
  const [{ name, withoutFormation, page, sortBy, sortOrder }, setFilters] =
    useQueryStates({
      name: parseAsString.withDefault(''),
      withoutFormation: parseAsBoolean.withDefault(false),
      page: parseAsInteger.withDefault(1),
      sortBy: parseAsStringEnum<TeamSortField>([
        'name',
        'averageOverallRating',
        'averageDefenseRating',
        'averageMidfieldRating',
        'averageAttackRating',
      ]).withDefault('averageOverallRating'),
      sortOrder: parseAsStringEnum<SortOrder>(['asc', 'desc']).withDefault(
        'desc',
      ),
    });

  const [draftName, setDraftName] = useDebouncedSearch(name, (value) => {
    setFilters({ name: value || null, page: 1 });
  });

  const { data, isPending, isError, error } = useTeams({
    name: name || undefined,
    withoutFormation: withoutFormation || undefined,
    page,
    pageSize: PAGE_SIZE,
    sortBy,
    sortOrder,
  });

  const teams = data?.data ?? [];

  const { sorting, onSortingChange } = useUrlSorting({
    sortBy,
    sortOrder,
    onSortingChange: ({ sortBy, sortOrder }) =>
      setFilters({ sortBy, sortOrder, page: 1 }),
  });

  const toggleWithoutFormation = () =>
    setFilters({ withoutFormation: withoutFormation ? null : true, page: 1 });

  return {
    teams,
    sorting,
    onSortingChange,
    setFilters,
    draftName,
    setDraftName,
    withoutFormation,
    toggleWithoutFormation,
    isPending,
    isError,
    error,
    data,
  };
};
