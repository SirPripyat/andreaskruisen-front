import { api } from '@/lib';

export const advancePhase = async (tournamentId: string, phaseId: string) => {
  await api.post(`/tournaments/${tournamentId}/phases/${phaseId}/advance`);
};
