import { api, type PaginatedResult } from '@/lib';
import type { ListTeamsQuery, TeamWithRatings } from '../types';

export const listTeamsPublic = (query: ListTeamsQuery) =>
  api
    .get<PaginatedResult<TeamWithRatings>>('/teams', { params: query })
    .then((res) => res.data);
