import { api } from '@/lib';
import type { Squad } from '../types';

export const assignSquad = (
  seasonId: string,
  payload: { userId: string; teamId: string },
) =>
  api
    .post<Squad>(`/squads/${seasonId}/squads/assign`, payload)
    .then((res) => res.data);
