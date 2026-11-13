import { api } from '@/lib';

export const advancePhase = (tournamentId: string, phaseId: string) =>
  api.post(`/tournaments/${tournamentId}/phases/${phaseId}/advance`);
