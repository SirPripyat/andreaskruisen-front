import { useQuery } from '@tanstack/react-query';
import { listSquads } from '../api';

export const useSeasonSquads = (seasonId: string | undefined) => {
  return useQuery({
    queryKey: ['squads', seasonId],
    queryFn: () => listSquads(seasonId as string),
    enabled: !!seasonId,
  });
};
