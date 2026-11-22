import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import type { GetTournamentFixturesQuery, MatchesByPhase } from '../api';
import { getTournamentFixtures } from '../api';

export type { MatchesByPhase };

export const useTournamentAllMatches = (
  tournamentId: string | undefined,
  query?: GetTournamentFixturesQuery,
): {
  phases: MatchesByPhase[];
  isPending: boolean;
} => {
  const { data, isPending } = useQuery({
    queryKey: queryKeys.tournaments.fixtures(tournamentId, query),
    queryFn: () => getTournamentFixtures(tournamentId as string, query),
    enabled: !!tournamentId,
  });

  return {
    phases: data ?? [],
    isPending,
  };
};
