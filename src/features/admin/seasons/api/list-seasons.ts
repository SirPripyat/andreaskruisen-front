import { api } from '@/lib';
import type { Season } from './season';

export async function listSeasons() {
  const { data } = await api.get<Season[]>('/seasons');
  return data;
}
