import { api } from '@/lib';
import type { Tournament, TournamentFormat } from '../types';

export type UpdateTournamentPayload = {
  name?: string;
  format?: TournamentFormat;
  maxTeams?: number;
};

export const updateTournament = (
  tournamentId: string,
  payload: UpdateTournamentPayload,
) =>
  api
    .patch<Tournament>(`/tournaments/${tournamentId}`, payload)
    .then((res) => res.data);
