import { api, type PaginatedResult } from '@/lib';
import type { ListTeamsQuery, TeamWithRatings } from '../types';

export const listTeams = (query: ListTeamsQuery) =>
  api
    .get<PaginatedResult<TeamWithRatings>>('/teams', { params: query })
    .then((res) => res.data);
