import { api } from '@/lib';
import type { PlayerDetail } from './player';

export const getPlayer = async (id: string) => {
  const { data } = await api.get<PlayerDetail>(`/players/${id}`);
  return data;
};
