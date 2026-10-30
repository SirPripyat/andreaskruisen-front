import { api } from '@/lib';

export async function deleteTournament(tournamentId: string) {
  await api.delete(`/tournaments/${tournamentId}`);
}
