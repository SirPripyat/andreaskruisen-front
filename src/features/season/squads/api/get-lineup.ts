import { api } from '@/lib';
import type { RosterPlayer } from './roster-player';

export async function getLineup(seasonId: string, teamId: string) {
  const { data } = await api.get<RosterPlayer[]>(
    `/seasons/${seasonId}/squads/${teamId}/lineup`,
  );
  return data;
}
