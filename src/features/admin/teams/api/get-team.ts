import { api } from '@/lib';
import type { TeamWithRatings } from './team';

export async function getTeam(id: string) {
  const { data } = await api.get<TeamWithRatings>(`/teams/${id}`);
  return data;
}
