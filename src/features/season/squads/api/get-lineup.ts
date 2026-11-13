import { api } from '@/lib';
import type { LineupOverview } from '../types';

export const getLineup = (teamId: string) =>
  api.get<LineupOverview>(`/squads/${teamId}/lineup`).then((res) => res.data);
