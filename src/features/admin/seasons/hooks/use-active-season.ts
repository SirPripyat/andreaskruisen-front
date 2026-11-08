import { useQuery } from '@tanstack/react-query';
import { getActiveSeason } from '../api';

export const useActiveSeason = () => {
  return useQuery({
    queryKey: ['seasons', 'active'],
    queryFn: getActiveSeason,
    retry: false,
    retryOnMount: false,
  });
};
