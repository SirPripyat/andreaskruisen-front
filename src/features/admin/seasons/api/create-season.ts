import { api } from '@/lib';
import type { CreateSeasonPayload, Season } from '../types';

export const createSeason = (payload: CreateSeasonPayload) =>
  api.post<Season>('/seasons', payload).then((res) => res.data);
