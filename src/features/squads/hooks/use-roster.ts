import { useQuery } from '@tanstack/react-query';
import { getRoster } from '../api';

export function useRoster(
  seasonId: string | undefined,
  teamId: string | undefined,
) {
  return useQuery({
    queryKey: ['roster', seasonId, teamId],
    queryFn: () => getRoster(seasonId as string, teamId as string),
    enabled: !!seasonId && !!teamId,
  });
}
