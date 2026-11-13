import { api } from '@/lib';
import type { PlayerDetail } from '../types';

export const getPlayer = (id: string) =>
  api.get<PlayerDetail>(`/players/${id}`).then((res) => res.data);
