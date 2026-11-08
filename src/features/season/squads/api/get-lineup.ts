import { api } from '@/lib';
import type { LineupOverview } from './lineup-overview';

export const getLineup = async (seasonId: string, teamId: string) => {
  const { data } = await api.get<LineupOverview>(
    `/seasons/${seasonId}/squads/${teamId}/lineup`,
  );
  return data;
};
