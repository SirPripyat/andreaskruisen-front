import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getTeamTitles } from '../api';

export const useTeamTitles = (id: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.team.titles(id),
    queryFn: () => getTeamTitles(id as string),
    enabled: !!id && enabled,
  });
};
