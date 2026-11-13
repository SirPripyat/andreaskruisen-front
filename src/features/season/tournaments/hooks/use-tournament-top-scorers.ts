import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getTournamentTopScorers } from '../api';

export const useTournamentTopScorers = (tournamentId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.tournaments.topScorers(tournamentId),
    queryFn: () => getTournamentTopScorers(tournamentId as string),
    enabled: !!tournamentId,
  });
};
