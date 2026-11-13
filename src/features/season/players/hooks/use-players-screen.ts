import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';
import {
  type PlayerSortField,
  type PlayersAdvancedFilters,
  POSITION_CODES,
  PREFERRED_FOOT_VALUES,
  SKILL_RATING_FIELDS,
} from '@/features/admin/players';
import { useDebouncedSearch, useUrlSorting } from '@/hooks';
import { nullsToUndefined, type SortOrder } from '@/lib';
import { useSeasonPlayers } from './use-players';

const PAGE_SIZE = 10;

// Um par de parsers min/max por atributo filtrável por range, igual ao
// backend gera os pares <campo>Min/<campo>Max em ListPlayersSchema.
const skillRangeParsers = Object.fromEntries(
  SKILL_RATING_FIELDS.flatMap((field) => [
    [`${field}Min`, parseAsInteger],
    [`${field}Max`, parseAsInteger],
  ]),
) as Record<string, typeof parseAsInteger>;

const ADVANCED_FILTER_PARSERS = {
  nationalityIds: parseAsArrayOf(parseAsString),
  leagueId: parseAsString,
  clubId: parseAsString,
  positions: parseAsArrayOf(parseAsStringEnum([...POSITION_CODES])),
  preferredFoot: parseAsStringEnum([...PREFERRED_FOOT_VALUES]),
  ageMin: parseAsInteger,
  ageMax: parseAsInteger,
  overallMin: parseAsInteger,
  overallMax: parseAsInteger,
  ...skillRangeParsers,
};

export const useSeasonPlayersScreen = () => {
  const [{ name, page, sortBy, sortOrder, ...advancedFilters }, setFilters] =
    useQueryStates({
      name: parseAsString.withDefault(''),
      page: parseAsInteger.withDefault(1),
      sortBy: parseAsStringEnum<PlayerSortField>([
        'name',
        'overallRating',
      ]).withDefault('overallRating'),
      sortOrder: parseAsStringEnum<SortOrder>(['asc', 'desc']).withDefault(
        'desc',
      ),
      ...ADVANCED_FILTER_PARSERS,
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
    ...nullsToUndefined(advancedFilters),
  });

  const players = data?.data ?? [];

  const { sorting, onSortingChange } = useUrlSorting({
    sortBy,
    sortOrder,
    onSortingChange: ({ sortBy, sortOrder }) =>
      setFilters({ sortBy, sortOrder, page: 1 }),
  });

  const activeAdvancedFilterCount = Object.values(advancedFilters).filter(
    (value) => value !== null && (!Array.isArray(value) || value.length > 0),
  ).length;

  const hasActiveFilters = Boolean(name) || activeAdvancedFilterCount > 0;

  const clearFilters = () => {
    setDraftName('');
    setFilters({
      name: null,
      ...Object.fromEntries(
        Object.keys(ADVANCED_FILTER_PARSERS).map((key) => [key, null]),
      ),
      page: 1,
    });
  };

  const applyAdvancedFilters = (values: PlayersAdvancedFilters) => {
    setFilters({
      ...Object.fromEntries(
        Object.keys(ADVANCED_FILTER_PARSERS).map((key) => [key, null]),
      ),
      ...values,
      page: 1,
    });
  };

  const clearAdvancedFilters = () => {
    setFilters({
      ...Object.fromEntries(
        Object.keys(ADVANCED_FILTER_PARSERS).map((key) => [key, null]),
      ),
      page: 1,
    });
  };

  return {
    players,
    sorting,
    onSortingChange,
    setFilters,
    draftName,
    setDraftName,
    advancedFilters: nullsToUndefined(advancedFilters),
    activeAdvancedFilterCount,
    hasActiveFilters,
    clearFilters,
    applyAdvancedFilters,
    clearAdvancedFilters,
    isPending,
    isError,
    error,
    data,
  };
};
