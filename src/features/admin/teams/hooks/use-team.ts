import { useQuery } from '@tanstack/react-query';
import { getTeam } from '../api';

export function useTeam(id: string | undefined) {
  return useQuery({
    queryKey: ['team', id],
    queryFn: () => getTeam(id as string),
    enabled: !!id,
  });
}
