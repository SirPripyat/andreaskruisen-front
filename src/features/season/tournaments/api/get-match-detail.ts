import { api } from '@/lib';
import type { MatchDetail } from './tournament';

export const getMatchDetail = async (matchId: string) => {
  const { data } = await api.get<MatchDetail>(`/matches/${matchId}`);
  return data;
};
