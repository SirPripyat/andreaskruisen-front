import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getMyActiveSeason } from '../api';

export const useMyActiveSeason = () => {
  return useQuery({
    queryKey: queryKeys.me.activeSeason,
    queryFn: getMyActiveSeason,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    retryOnMount: false,
  });
};
