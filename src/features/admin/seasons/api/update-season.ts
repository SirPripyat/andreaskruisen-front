import { api } from '@/lib';
import type { Season } from './season';

export type UpdateSeasonPayload = {
  name: string;
};

export const updateSeason = async (
  seasonId: string,
  payload: UpdateSeasonPayload,
) => {
  const { data } = await api.patch<Season>(`/seasons/${seasonId}`, payload);
  return data;
};
