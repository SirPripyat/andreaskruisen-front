import { api } from '@/lib';
import type { MatchDetail } from '../types';

export const simulateMatch = (matchId: string) =>
  api.post<MatchDetail>(`/matches/${matchId}/simulate`).then((res) => res.data);
