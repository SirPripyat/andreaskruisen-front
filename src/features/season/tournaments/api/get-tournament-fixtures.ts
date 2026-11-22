import { api, serializeQueryParams } from '@/lib';
import type { MatchListItem, PhaseSummary } from '../types';

export type MatchesByPhase = {
  phase: PhaseSummary;
  matches: MatchListItem[];
};

export type GetTournamentFixturesQuery = {
  onlyOwnedTeams?: boolean;
};

export const getTournamentFixtures = (
  tournamentId: string,
  query?: GetTournamentFixturesQuery,
) =>
  api
    .get<MatchesByPhase[]>(`/tournaments/${tournamentId}/fixtures`, {
      params: serializeQueryParams(query ?? {}),
    })
    .then((res) => res.data);
