import { api } from '@/lib';
import type { TournamentSummary } from '../types';

export const getTournament = (tournamentId: string) =>
  api
    .get<TournamentSummary>(`/tournaments/${tournamentId}`)
    .then((res) => res.data);
