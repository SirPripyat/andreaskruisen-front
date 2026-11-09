import { api } from '@/lib';
import type { LineupOverview } from './lineup-overview';

export const getLineup = async (teamId: string) => {
  const { data } = await api.get<LineupOverview>(`/squads/${teamId}/lineup`);
  return data;
};
