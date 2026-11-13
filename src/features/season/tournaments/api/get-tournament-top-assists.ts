import { api } from '@/lib';
import type { GoalLeader } from '../types';

export const getTournamentTopAssists = (tournamentId: string) =>
  api
    .get<GoalLeader[]>(`/tournaments/${tournamentId}/top-assists`)
    .then((res) => res.data);
