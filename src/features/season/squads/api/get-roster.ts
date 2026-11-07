import { api } from '@/lib';
import type { RosterBySector } from './roster-by-sector';

export async function getRoster(seasonId: string, teamId: string) {
  const { data } = await api.get<RosterBySector>(
    `/seasons/${seasonId}/squads/${teamId}/players`,
  );
  return data;
}
