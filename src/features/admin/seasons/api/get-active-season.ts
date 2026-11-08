import { api } from '@/lib';
import type { Season } from './season';

export const getActiveSeason = async () => {
  const { data } = await api.get<Season>('/seasons/active');
  return data;
};
