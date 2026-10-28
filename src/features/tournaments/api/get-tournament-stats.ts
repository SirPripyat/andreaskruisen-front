import { api } from '@/lib';
import type { TournamentStats } from './tournament';

export async function getTournamentStats(tournamentId: string) {
  const { data } = await api.get<TournamentStats>(
    `/tournaments/${tournamentId}/stats`,
  );
  return data;
}
