import { api, type PaginatedResult, serializeQueryParams } from '@/lib';
import type { MatchListItem, PhaseSummary } from '../types';

export type ListTournamentMatchesQuery = {
  round?: number;
  page: number;
  pageSize: number;
  onlyOwnedTeams?: boolean;
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
      params: serializeQueryParams({ ...query, tournamentId }),
    })
    .then((res) => res.data);
