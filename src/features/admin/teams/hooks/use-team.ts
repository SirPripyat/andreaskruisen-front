import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getTeam } from '../api';

export const useTeam = (id: string | undefined, open: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.team.detail(id),
    queryFn: () => getTeam(id as string),
    enabled: open && !!id,
  });
};
