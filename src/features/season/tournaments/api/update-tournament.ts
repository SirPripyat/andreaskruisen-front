import { api } from '@/lib';
import type { Tournament, TournamentFormat } from './tournament';

export type UpdateTournamentPayload = {
  name?: string;
  format?: TournamentFormat;
  maxTeams?: number;
};

export const updateTournament = async (
  tournamentId: string,
  payload: UpdateTournamentPayload,
) => {
  const { data } = await api.patch<Tournament>(
    `/tournaments/${tournamentId}`,
    payload,
  );
  return data;
};
