import { useQuery } from '@tanstack/react-query';
import { getTournamentSituation } from '../api';

export function useTournamentSituation(
  tournamentId: string | undefined,
  query?: { onlyOwnedTeams?: boolean; round?: number },
) {
  return useQuery({
    queryKey: ['tournament', tournamentId, 'situation', query],
    queryFn: () => getTournamentSituation(tournamentId as string, query),
    enabled: !!tournamentId,
  });
}
