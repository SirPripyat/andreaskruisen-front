import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';
import type { SortOrder } from '@/lib';
import type { TeamSortField } from '../types';

const sortByDefault = parseAsStringEnum<TeamSortField>([
  'name',
  'averageOverallRating',
  'averageDefenseRating',
  'averageMidfieldRating',
  'averageAttackRating',
]).withDefault('averageOverallRating');

export const useTeamFilters = () => {
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
