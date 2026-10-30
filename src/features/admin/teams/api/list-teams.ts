import { api, type PaginatedResult } from '@/lib';
import type { ListTeamsQuery } from './schema';
import type { TeamWithRatings } from './team';

export async function listTeams(query: ListTeamsQuery) {
  const { data } = await api.get<PaginatedResult<TeamWithRatings>>('/teams', {
    params: query,
  });
  return data;
}
