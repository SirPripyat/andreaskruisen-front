import { api } from '@/lib';
import type { SimilarPlayersResult } from '../types';

export const getSimilarPlayers = (id: string, limit?: number) =>
  api
    .get<SimilarPlayersResult>(`/players/${id}/similar`, { params: { limit } })
    .then((res) => res.data);
