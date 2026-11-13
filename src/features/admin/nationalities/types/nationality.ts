import type { SortOrder } from '@/lib';

export type Nationality = {
  id: string;
  name: string;
  flagUrl: string;
};

export type NationalitySortField = 'name';

export type ListNationalitiesQuery = {
  name?: string;
  page: number;
  pageSize: number;
  sortBy: NationalitySortField;
  sortOrder: SortOrder;
};
