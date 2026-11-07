import { api } from '@/lib';
import type { League } from './league';

export async function listLeagues() {
  const { data } = await api.get<League[]>('/leagues');
  return data;
}
