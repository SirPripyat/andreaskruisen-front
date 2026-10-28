import { useQuery } from '@tanstack/react-query';
import { listSeasons } from '../api';

export function useSeasons() {
  return useQuery({
    queryKey: ['seasons'],
    queryFn: listSeasons,
  });
}
