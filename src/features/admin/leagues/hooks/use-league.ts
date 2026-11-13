import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getLeague } from '../api';

export const useLeague = (id: string | undefined, open: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.leagues.detail(id),
    queryFn: () => getLeague(id as string),
    enabled: open && !!id,
  });
};
