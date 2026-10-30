import { useQuery } from '@tanstack/react-query';
import type { ListTournamentMatchesQuery } from '../api';
import { getTournamentMatches } from '../api';

export function useTournamentMatches(
  tournamentId: string | undefined,
  query: ListTournamentMatchesQuery,
) {
  return useQuery({
    queryKey: ['tournament', tournamentId, 'matches', query],
    queryFn: () => getTournamentMatches(tournamentId as string, query),
    enabled: !!tournamentId,
  });
}
