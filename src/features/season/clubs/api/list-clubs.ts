import { api, type PaginatedResult } from '@/lib';
import type { ClubWithRatings, ListClubsQuery } from '../types';

export const listClubs = (query: ListClubsQuery) =>
  api
    .get<PaginatedResult<ClubWithRatings>>('/teams', { params: query })
    .then((resp) => resp.data);
