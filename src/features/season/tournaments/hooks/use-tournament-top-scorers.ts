import { useQuery } from '@tanstack/react-query';
import { getTournamentTopScorers } from '../api';

export const useTournamentTopScorers = (tournamentId: string | undefined) => {
  return useQuery({
    queryKey: ['tournament', tournamentId, 'top-scorers'],
    queryFn: () => getTournamentTopScorers(tournamentId as string),
    enabled: !!tournamentId,
  });
};
