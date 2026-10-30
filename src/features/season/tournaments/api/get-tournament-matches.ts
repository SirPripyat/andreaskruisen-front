import { api, type PaginatedResult } from '@/lib';
import type { MatchListItem, PhaseSummary } from './tournament';

export type ListTournamentMatchesQuery = {
  round?: number;
  page: number;
  pageSize: number;
};

export type TournamentMatchesPage = PaginatedResult<MatchListItem> & {
  phase: PhaseSummary;
};

export async function getTournamentMatches(
  tournamentId: string,
  query: ListTournamentMatchesQuery,
) {
  const { data } = await api.get<TournamentMatchesPage>(
    `/tournaments/${tournamentId}/matches`,
    { params: query },
  );
  return data;
}
