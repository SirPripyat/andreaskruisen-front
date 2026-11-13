import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import type { ListTournamentMatchesQuery } from '../api';
import { getTournamentMatches } from '../api';

export const useTournamentMatches = (
  tournamentId: string | undefined,
  query: ListTournamentMatchesQuery,
) => {
  return useQuery({
    queryKey: queryKeys.tournaments.matches(tournamentId, query),
    queryFn: () => getTournamentMatches(tournamentId as string, query),
    enabled: !!tournamentId,
  });
};
