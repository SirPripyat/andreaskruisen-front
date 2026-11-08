import { api } from '@/lib';
import type { Season } from './season';

export const listSeasons = async () => {
  const { data } = await api.get<Season[]>('/seasons');
  return data;
};
