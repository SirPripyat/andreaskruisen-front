import { api } from '@/lib';

export async function advancePhase(tournamentId: string, phaseId: string) {
  await api.post(`/tournaments/${tournamentId}/phases/${phaseId}/advance`);
}
