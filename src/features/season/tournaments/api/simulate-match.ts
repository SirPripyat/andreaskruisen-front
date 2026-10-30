import { api } from '@/lib';
import type { MatchDetail } from './tournament';

export async function simulateMatch(tournamentId: string, matchId: string) {
  const { data } = await api.post<MatchDetail>(
    `/tournaments/${tournamentId}/matches/${matchId}/simulate`,
  );
  return data;
}
