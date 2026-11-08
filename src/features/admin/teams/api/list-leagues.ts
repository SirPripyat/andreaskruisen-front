import { api } from '@/lib';
import type { League } from './league';

export const listLeagues = async () => {
  const { data } = await api.get<League[]>('/leagues');
  return data;
};
