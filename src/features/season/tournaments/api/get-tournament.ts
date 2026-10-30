import { api } from '@/lib';
import type { TournamentSummary } from './tournament';

export async function getTournament(tournamentId: string) {
  const { data } = await api.get<TournamentSummary>(
    `/tournaments/${tournamentId}`,
  );
  return data;
}
