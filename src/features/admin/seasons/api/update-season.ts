import { api } from '@/lib';
import type { Season } from './season';

export type UpdateSeasonPayload = {
  name: string;
};

export async function updateSeason(
  seasonId: string,
  payload: UpdateSeasonPayload,
) {
  const { data } = await api.patch<Season>(`/seasons/${seasonId}`, payload);
  return data;
}
