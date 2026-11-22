import type { TeamStats, TeamTitle } from '@/features/admin/teams';
import type { SortOrder } from '@/lib';

export type Club = {
  id: string;
  name: string;
  crestUrl: string;
};

export type ClubWithRatings = Club & {
  league: { id: string; name: string; logoUrl: string };
  averageOverallRating: number | null;
  averageDefenseRating: number | null;
  averageMidfieldRating: number | null;
  averageAttackRating: number | null;
  formation: string | null;
};

export type ClubDetails = ClubWithRatings & TeamStats;

export type ClubTitle = TeamTitle;

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
