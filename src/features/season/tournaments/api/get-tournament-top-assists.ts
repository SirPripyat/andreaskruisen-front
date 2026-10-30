import { api } from '@/lib';
import type { GoalLeader } from './tournament';

export async function getTournamentTopAssists(tournamentId: string) {
  const { data } = await api.get<GoalLeader[]>(
    `/tournaments/${tournamentId}/top-assists`,
  );
  return data;
}
