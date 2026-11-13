import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';
import { useDebouncedSearch, useUrlSorting } from '@/hooks';
import type { SortOrder } from '@/lib';
import type { NationalitySortField } from '../types';
import { useNationalities } from './use-nationalities';

const PAGE_SIZE = 10;

export const useNationalitiesScreen = () => {
  const [{ name, page, sortBy, sortOrder }, setFilters] = useQueryStates({
    name: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    sortBy: parseAsStringEnum<NationalitySortField>(['name']).withDefault(
      'name',
    ),
    sortOrder: parseAsStringEnum<SortOrder>(['asc', 'desc']).withDefault('asc'),
  });

  const [draftName, setDraftName] = useDebouncedSearch(name, (value) => {
    setFilters({ name: value || null, page: 1 });
  });

  const { data, isPending, isError, error } = useNationalities({
    name: name || undefined,
    page,
    pageSize: PAGE_SIZE,
    sortBy,
    sortOrder,
  });

  const nationalities = data?.data ?? [];

  const { sorting, onSortingChange } = useUrlSorting({
    sortBy,
    sortOrder,
    onSortingChange: ({ sortBy, sortOrder }) =>
      setFilters({ sortBy, sortOrder, page: 1 }),
  });

  return {
    nationalities,
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
