import { api } from '@/lib';
import type { MatchDetail } from './tournament';

export const getMatchDetail = async (tournamentId: string, matchId: string) => {
  const { data } = await api.get<MatchDetail>(
    `/tournaments/${tournamentId}/matches/${matchId}`,
  );
  return data;
};
