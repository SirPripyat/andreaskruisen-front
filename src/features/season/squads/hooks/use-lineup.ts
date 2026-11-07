import { useQuery } from '@tanstack/react-query';
import { getLineup } from '../api';

export function useLineup(
  seasonId: string | undefined,
  teamId: string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: ['lineup', seasonId, teamId],
    queryFn: () => getLineup(seasonId as string, teamId as string),
    enabled: !!seasonId && !!teamId && enabled,
  });
}
