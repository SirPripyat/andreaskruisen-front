import type { Nationality } from '@/features/admin/nationalities';
import type { SortOrder } from '@/lib';

export type LeagueSortField = 'name';

export type ListLeaguesQuery = {
  name?: string;
  page: number;
  pageSize: number;
  sortBy: LeagueSortField;
  sortOrder: SortOrder;
};

export type League = {
  id: string;
  name: string;
  logoUrl: string | null;
};

export type LeagueWithCountry = League & {
  country: Nationality | null;
};
