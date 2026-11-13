import { api } from '@/lib';
import type { TournamentDashboard } from '../types';

export const getTournamentDashboard = (tournamentId: string) =>
  api
    .get<TournamentDashboard>(`/tournaments/${tournamentId}/dashboard`)
    .then((res) => res.data);
