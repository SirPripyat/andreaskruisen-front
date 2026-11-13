import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';
import type { SortOrder } from '@/lib';
import type { ClubSortField } from '../types';

const sortByDefault = parseAsStringEnum<ClubSortField>([
  'name',
  'averageOverallRating',
  'averageDefenseRating',
  'averageMidfieldRating',
  'averageAttackRating',
]).withDefault('averageOverallRating');

export const useClubsFilters = () => {
  const [filters, setFilters] = useQueryStates({
    name: parseAsString.withDefault(''),
    leagueId: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    sortBy: sortByDefault,
    sortOrder: parseAsStringEnum<SortOrder>(['asc', 'desc']).withDefault(
      'desc',
    ),
  });

  return {
    filters,
    setFilters,
  };
};
