import { api } from '@/lib';

export const deleteTournament = (tournamentId: string) =>
  api.delete(`/tournaments/${tournamentId}`);
