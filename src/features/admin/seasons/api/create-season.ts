import { api } from '@/lib';
import type { CreateSeasonPayload } from './schema';
import type { Season } from './season';

export const createSeason = async (payload: CreateSeasonPayload) => {
  const { data } = await api.post<Season>('/seasons', payload);
  return data;
};
