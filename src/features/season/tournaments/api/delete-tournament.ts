import { api } from '@/lib';

export const deleteTournament = async (tournamentId: string) => {
  await api.delete(`/tournaments/${tournamentId}`);
};
