import type { League } from '@/features/admin/leagues';
import type { SortOrder } from '@/lib';

export type Club = {
  id: string;
  name: string;
  crestUrl: string;
};

export type ClubWithRatings = Club & {
  league: League;
  averageOverallRating: number | null;
  averageDefenseRating: number | null;
  averageMidfieldRating: number | null;
  averageAttackRating: number | null;
  formation: string | null;
};

export type ClubSortField =
  | 'name'
  | 'averageOverallRating'
  | 'averageDefenseRating'
  | 'averageMidfieldRating'
  | 'averageAttackRating';

export type ListClubsQuery = {
  name?: string;
  leagueId?: string;
  page: number;
  pageSize: number;
  sortBy: ClubSortField;
  sortOrder: SortOrder;
};
