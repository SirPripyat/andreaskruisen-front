import { api } from '@/lib';
import type { RosterPlayer } from './roster-player';

export async function getRoster(seasonId: string, teamId: string) {
  const { data } = await api.get<RosterPlayer[]>(
    `/seasons/${seasonId}/squads/${teamId}/players`,
  );
  return data;
}
