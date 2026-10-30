import { api } from '@/lib';
import type { Season } from './season';

export async function selectSeason(seasonId: string) {
  const { data } = await api.post<Season>(`/seasons/${seasonId}/select`);
  return data;
}
