import { useQuery } from '@tanstack/react-query';
import { getTournamentStats } from '../api';

export function useTournamentStats(tournamentId: string | undefined) {
  return useQuery({
    queryKey: ['tournament', tournamentId, 'stats'],
    queryFn: () => getTournamentStats(tournamentId as string),
    enabled: !!tournamentId,
  });
}
