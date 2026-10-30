import { api } from '@/lib';
import type { SeasonSquad } from './squad';

export async function listSquads(seasonId: string) {
  const { data } = await api.get<SeasonSquad[]>(`/seasons/${seasonId}/squads`);
  return data;
}
