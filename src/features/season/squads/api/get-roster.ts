import { api } from '@/lib';
import type { RosterBySector } from '../types';

export const getRoster = (teamId: string) =>
  api.get<RosterBySector>(`/squads/${teamId}/players`).then((res) => res.data);
