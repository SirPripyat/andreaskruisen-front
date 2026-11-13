import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getMatchDetail } from '../api';

export const useMatchDetail = (
  tournamentId: string | undefined,
  matchId: string | undefined,
) => {
  return useQuery({
    queryKey: queryKeys.tournaments.match(tournamentId, matchId),
    queryFn: () => getMatchDetail(matchId as string),
    enabled: !!tournamentId && !!matchId,
  });
};
