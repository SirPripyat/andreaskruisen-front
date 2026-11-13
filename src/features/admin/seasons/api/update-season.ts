import { api } from '@/lib';
import type { Season } from '../types';

export type UpdateSeasonPayload = {
  name: string;
};

export const updateSeason = (seasonId: string, payload: UpdateSeasonPayload) =>
  api.patch<Season>(`/seasons/${seasonId}`, payload).then((res) => res.data);
