import { api } from '@/lib';
import type { GoalLeader } from './tournament';

export async function getTournamentTopScorers(tournamentId: string) {
  const { data } = await api.get<GoalLeader[]>(
    `/tournaments/${tournamentId}/top-scorers`,
  );
  return data;
}
