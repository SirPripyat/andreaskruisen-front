import { useQuery } from '@tanstack/react-query';
import { getActiveSeason } from '../api';

export function useActiveSeason() {
  return useQuery({
    queryKey: ['seasons', 'active'],
    queryFn: getActiveSeason,
    retry: false,
  });
}
