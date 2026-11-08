import { api } from '@/lib';
import type { GoalLeader } from './tournament';

export const getTournamentTopAssists = async (tournamentId: string) => {
  const { data } = await api.get<GoalLeader[]>(
    `/tournaments/${tournamentId}/top-assists`,
  );
  return data;
};
