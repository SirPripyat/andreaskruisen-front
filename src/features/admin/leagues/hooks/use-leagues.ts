import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { listLeagues } from '../api';
import type { ListLeaguesQuery } from '../types';

export const useLeagues = (
  query: ListLeaguesQuery,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.leagues.list(query),
    queryFn: () => listLeagues(query),
    placeholderData: (previousData) => previousData,
    enabled: options?.enabled,
  });
};
