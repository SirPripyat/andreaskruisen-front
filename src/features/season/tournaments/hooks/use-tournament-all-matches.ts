import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import type { MatchesByPhase } from '../api';
import { getTournamentFixtures } from '../api';

export type { MatchesByPhase };

export const useTournamentAllMatches = (
  tournamentId: string | undefined,
): {
  phases: MatchesByPhase[];
  isPending: boolean;
} => {
  const { data, isPending } = useQuery({
    queryKey: queryKeys.tournaments.fixtures(tournamentId),
    queryFn: () => getTournamentFixtures(tournamentId as string),
    enabled: !!tournamentId,
  });

  return {
    phases: data ?? [],
    isPending,
  };
};
