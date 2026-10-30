import { useQuery } from '@tanstack/react-query';
import { getMatchDetail } from '../api';

export function useMatchDetail(
  tournamentId: string | undefined,
  matchId: string | undefined,
) {
  return useQuery({
    queryKey: ['tournament', tournamentId, 'matches', matchId],
    queryFn: () => getMatchDetail(tournamentId as string, matchId as string),
    enabled: !!tournamentId && !!matchId,
  });
}
