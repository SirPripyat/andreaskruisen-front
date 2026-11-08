import { api, type PaginatedResult } from '@/lib';
import type { ListTeamsQuery } from './schema';
import type { TeamWithRatings } from './team';

export const listTeams = async (query: ListTeamsQuery) => {
  const { data } = await api.get<PaginatedResult<TeamWithRatings>>('/teams', {
    params: query,
  });
  return data;
};
