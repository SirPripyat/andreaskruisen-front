import { api } from '@/lib';
import type { CreateSeasonPayload } from './schema';
import type { Season } from './season';

export async function createSeason(payload: CreateSeasonPayload) {
  const { data } = await api.post<Season>('/seasons', payload);
  return data;
}
