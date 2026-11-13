import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getTournamentTopAssists } from '../api';

export const useTournamentTopAssists = (tournamentId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.tournaments.topAssists(tournamentId),
    queryFn: () => getTournamentTopAssists(tournamentId as string),
    enabled: !!tournamentId,
  });
};
