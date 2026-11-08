import { api } from '@/lib';
import type { Squad } from './squad';

export const assignSquad = async (
  seasonId: string,
  payload: { userId: string; teamId: string },
) => {
  const { data } = await api.post<Squad>(
    `/seasons/${seasonId}/squads/assign`,
    payload,
  );
  return data;
};
