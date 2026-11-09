import { api } from '@/lib';
import type { RosterBySector } from './roster-by-sector';

export const getRoster = async (teamId: string) => {
  const { data } = await api.get<RosterBySector>(`/squads/${teamId}/players`);
  return data;
};
