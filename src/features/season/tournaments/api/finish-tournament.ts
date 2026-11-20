import { api } from '@/lib';

export const finishTournament = (tournamentId: string) =>
  api.post(`/tournaments/${tournamentId}/finish`);
