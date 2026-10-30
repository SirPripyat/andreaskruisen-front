import type { SortOrder } from '@/lib';

export type TeamSortField =
  | 'name'
  | 'averageOverallRating'
  | 'averageDefenseRating'
  | 'averageMidfieldRating'
  | 'averageAttackRating';

export type ListTeamsQuery = {
  name?: string;
  withoutFormation?: boolean;
  page: number;
  pageSize: number;
  sortBy: TeamSortField;
  sortOrder: SortOrder;
};
