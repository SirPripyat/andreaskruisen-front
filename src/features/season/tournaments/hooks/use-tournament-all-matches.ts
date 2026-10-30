import { useQuery } from '@tanstack/react-query';
import type { MatchesByPhase } from '../api';
import { getTournamentFixtures } from '../api';

export type { MatchesByPhase };

export function useTournamentAllMatches(tournamentId: string | undefined): {
  phases: MatchesByPhase[];
  isPending: boolean;
} {
  const { data, isPending } = useQuery({
    queryKey: ['tournament', tournamentId, 'fixtures'],
    queryFn: () => getTournamentFixtures(tournamentId as string),
    enabled: !!tournamentId,
  });

  return {
    phases: data ?? [],
    isPending,
  };
}
