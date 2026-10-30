import { useQuery } from '@tanstack/react-query';
import { listTournaments } from '../api';

export function useTournaments(seasonId: string | undefined) {
  return useQuery({
    queryKey: ['tournaments', seasonId],
    queryFn: () => listTournaments(seasonId as string),
    enabled: !!seasonId,
  });
}
