import { api } from '@/lib';
import type { MatchListItem, PhaseSummary } from './tournament';

export type MatchesByPhase = {
  phase: PhaseSummary;
  matches: MatchListItem[];
};

export async function getTournamentFixtures(tournamentId: string) {
  const { data } = await api.get<MatchesByPhase[]>(
    `/tournaments/${tournamentId}/fixtures`,
  );
  return data;
}
