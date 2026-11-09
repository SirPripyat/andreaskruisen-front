import { useQuery } from '@tanstack/react-query';
import { listSeasons } from '../api';

export const useSeasons = () => {
  return useQuery({
    queryKey: ['seasons'],
    queryFn: listSeasons,
    staleTime: 5 * 60 * 1000,
  });
};
