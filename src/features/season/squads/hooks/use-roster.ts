import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getRoster } from '../api';

export const useRoster = (teamId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.roster.detail(teamId),
    queryFn: () => getRoster(teamId as string),
    enabled: !!teamId && enabled,
  });
};
