import { api, type PaginatedResult } from '@/lib';
import type { MatchListItem, PhaseSummary } from '../types';

export type ListTournamentMatchesQuery = {
  round?: number;
  page: number;
  pageSize: number;
};

export type TournamentMatchesPage = PaginatedResult<MatchListItem> & {
  phase: PhaseSummary;
};

export const getTournamentMatches = (
  tournamentId: string,
  query: ListTournamentMatchesQuery,
) =>
  api
    .get<TournamentMatchesPage>('/matches', {
      params: { ...query, tournamentId },
    })
    .then((res) => res.data);
