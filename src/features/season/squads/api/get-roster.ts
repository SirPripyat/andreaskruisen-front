import { api } from '@/lib';
import type { RosterBySector } from './roster-by-sector';

export const getRoster = async (seasonId: string, teamId: string) => {
  const { data } = await api.get<RosterBySector>(
    `/seasons/${seasonId}/squads/${teamId}/players`,
  );
  return data;
};
