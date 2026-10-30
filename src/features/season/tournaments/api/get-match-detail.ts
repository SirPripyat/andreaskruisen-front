import { api } from '@/lib';
import type { MatchDetail } from './tournament';

export async function getMatchDetail(tournamentId: string, matchId: string) {
  const { data } = await api.get<MatchDetail>(
    `/tournaments/${tournamentId}/matches/${matchId}`,
  );
  return data;
}
