import { api } from '@/lib';
import type { GoalLeader } from '../types';

export const getTournamentTopScorers = (tournamentId: string) =>
  api
    .get<GoalLeader[]>(`/tournaments/${tournamentId}/top-scorers`)
    .then((res) => res.data);
