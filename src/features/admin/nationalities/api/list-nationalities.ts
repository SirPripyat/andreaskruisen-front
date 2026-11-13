import { api, type PaginatedResult } from '@/lib';
import type { ListNationalitiesQuery, Nationality } from '../types';

export const listNationalities = (query: ListNationalitiesQuery) =>
  api
    .get<PaginatedResult<Nationality>>('/nationalities', { params: query })
    .then((res) => res.data);
