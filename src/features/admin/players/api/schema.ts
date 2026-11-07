import type { SortOrder } from '@/lib';

export type PlayerSortField = 'name' | 'overallRating';

export type ListPlayersQuery = {
  name?: string;
  page: number;
  pageSize: number;
  sortBy: PlayerSortField;
  sortOrder: SortOrder;
};
