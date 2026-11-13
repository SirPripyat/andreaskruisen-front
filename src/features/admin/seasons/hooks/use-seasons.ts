import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { listSeasons } from '../api';

export const useSeasons = () => {
  return useQuery({
    queryKey: queryKeys.seasons.all,
    queryFn: listSeasons,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
