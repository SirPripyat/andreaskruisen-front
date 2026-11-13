import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getLineup } from '../api';

export const useLineup = (teamId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.lineup.detail(teamId),
    queryFn: () => getLineup(teamId as string),
    enabled: !!teamId && enabled,
  });
};
