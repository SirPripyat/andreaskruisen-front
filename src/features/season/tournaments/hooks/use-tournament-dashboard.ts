import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getTournamentDashboard } from '../api';

export const useTournamentDashboard = (tournamentId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.tournaments.dashboard(tournamentId),
    queryFn: () => getTournamentDashboard(tournamentId as string),
    enabled: !!tournamentId,
  });
};
