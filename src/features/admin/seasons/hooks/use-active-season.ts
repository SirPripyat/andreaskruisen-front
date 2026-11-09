import { useQuery } from '@tanstack/react-query';
import { getActiveSeason } from '../api';

export const useActiveSeason = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['seasons', 'active'],
    queryFn: getActiveSeason,
    enabled: options?.enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
    retryOnMount: false,
  });
};
