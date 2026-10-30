import { api } from '@/lib';
import type { Squad } from './squad';

export async function assignSquad(
  seasonId: string,
  payload: { userId: string; teamId: string },
) {
  const { data } = await api.post<Squad>(
    `/seasons/${seasonId}/squads/assign`,
    payload,
  );
  return data;
}
