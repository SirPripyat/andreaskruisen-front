import { api } from '@/lib';
import type { MatchListItem, PhaseSummary } from '../types';

export type MatchesByPhase = {
  phase: PhaseSummary;
  matches: MatchListItem[];
};

export const getTournamentFixtures = (tournamentId: string) =>
  api
    .get<MatchesByPhase[]>(`/tournaments/${tournamentId}/fixtures`)
    .then((res) => res.data);
