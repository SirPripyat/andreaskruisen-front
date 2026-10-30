import { useQuery } from '@tanstack/react-query';
import { getTournament } from '../api';

export function useTournament(tournamentId: string | undefined) {
  return useQuery({
    queryKey: ['tournament', tournamentId],
    queryFn: () => getTournament(tournamentId as string),
    enabled: !!tournamentId,
  });
}
