import { useQuery } from '@tanstack/react-query';
import { listSquads } from '../api';

export function useSeasonSquads(seasonId: string | undefined) {
  return useQuery({
    queryKey: ['squads', seasonId],
    queryFn: () => listSquads(seasonId as string),
    enabled: !!seasonId,
  });
}
