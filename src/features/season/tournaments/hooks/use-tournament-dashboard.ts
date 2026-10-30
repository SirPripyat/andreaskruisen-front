import { useQuery } from '@tanstack/react-query';
import { getTournamentDashboard } from '../api';

export function useTournamentDashboard(tournamentId: string | undefined) {
  return useQuery({
    queryKey: ['tournament', tournamentId, 'dashboard'],
    queryFn: () => getTournamentDashboard(tournamentId as string),
    enabled: !!tournamentId,
  });
}
