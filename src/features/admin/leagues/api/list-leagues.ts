import { api, type PaginatedResult } from '@/lib';
import type { LeagueWithCountry, ListLeaguesQuery } from '../types';

export const listLeagues = (query: ListLeaguesQuery) =>
  api
    .get<PaginatedResult<LeagueWithCountry>>('/leagues', { params: query })
    .then((res) => res.data);
