import { api } from '@/lib';
import type { LineupOverview } from './lineup-overview';

export async function getLineup(seasonId: string, teamId: string) {
  const { data } = await api.get<LineupOverview>(
    `/seasons/${seasonId}/squads/${teamId}/lineup`,
  );
  return data;
}
