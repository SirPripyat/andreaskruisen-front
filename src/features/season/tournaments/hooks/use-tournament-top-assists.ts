import { useQuery } from '@tanstack/react-query';
import { getTournamentTopAssists } from '../api';

export function useTournamentTopAssists(tournamentId: string | undefined) {
  return useQuery({
    queryKey: ['tournament', tournamentId, 'top-assists'],
    queryFn: () => getTournamentTopAssists(tournamentId as string),
    enabled: !!tournamentId,
  });
}
