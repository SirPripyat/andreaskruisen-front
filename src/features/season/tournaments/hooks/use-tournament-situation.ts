import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getTournamentSituation } from '../api';

export const useTournamentSituation = (
  tournamentId: string | undefined,
  query?: { onlyOwnedTeams?: boolean; round?: number },
) => {
  return useQuery({
    queryKey: queryKeys.tournaments.situation(tournamentId, query),
    queryFn: () => getTournamentSituation(tournamentId as string, query),
    enabled: !!tournamentId,
  });
};
