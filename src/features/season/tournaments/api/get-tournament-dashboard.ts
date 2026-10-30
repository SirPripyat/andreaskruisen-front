import { api } from '@/lib';
import type { TournamentDashboard } from './tournament';

export async function getTournamentDashboard(tournamentId: string) {
  const { data } = await api.get<TournamentDashboard>(
    `/tournaments/${tournamentId}/dashboard`,
  );
  return data;
}
