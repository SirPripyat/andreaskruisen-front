import { api } from '@/lib';
import type { TeamTitle } from './team-title';

export const getTeamTitles = async (id: string) => {
  const { data } = await api.get<TeamTitle[]>(`/teams/${id}/titles`);
  return data;
};
