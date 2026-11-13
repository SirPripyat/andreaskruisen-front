import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { listSquads } from '../api';

export const useSeasonSquads = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.squads,
    queryFn: () => listSquads(),
    enabled: enabled,
  });
};
