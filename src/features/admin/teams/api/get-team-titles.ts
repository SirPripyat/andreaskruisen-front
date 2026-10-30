import { api } from '@/lib';
import type { TeamTitle } from './team-title';

export async function getTeamTitles(id: string) {
  const { data } = await api.get<TeamTitle[]>(`/teams/${id}/titles`);
  return data;
}
