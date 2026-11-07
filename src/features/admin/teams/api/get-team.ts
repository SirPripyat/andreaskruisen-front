import { api } from '@/lib';
import type { TeamDetails } from './team';

export async function getTeam(id: string) {
  const { data } = await api.get<TeamDetails>(`/teams/${id}`);
  return data;
}
