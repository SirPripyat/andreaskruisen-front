import { api } from '@/lib';
import type { MatchDetail } from './tournament';

export const simulateMatch = async (matchId: string) => {
  const { data } = await api.post<MatchDetail>(`/matches/${matchId}/simulate`);
  return data;
};
