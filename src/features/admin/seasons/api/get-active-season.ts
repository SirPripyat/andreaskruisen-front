import { api } from '@/lib';
import type { Season } from './season';

export async function getActiveSeason() {
  const { data } = await api.get<Season>('/seasons/active');
  return data;
}
