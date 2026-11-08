import { api } from '@/lib';
import type { TeamDetails } from './team';

export const getTeam = async (id: string) => {
  const { data } = await api.get<TeamDetails>(`/teams/${id}`);
  return data;
};
