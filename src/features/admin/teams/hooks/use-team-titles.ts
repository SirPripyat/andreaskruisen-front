import { useQuery } from '@tanstack/react-query';
import { getTeamTitles } from '../api';

export function useTeamTitles(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['team-titles', id],
    queryFn: () => getTeamTitles(id as string),
    enabled: !!id && enabled,
  });
}
