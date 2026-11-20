import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { listNegotiations } from '../api';
import type { ListNegotiationsQuery } from '../types';

export const useNegotiations = (
  query: ListNegotiationsQuery,
  enabled = true,
) => {
  return useQuery({
    queryKey: queryKeys.negotiations.list(query),
    queryFn: () => listNegotiations(query),
    enabled,
  });
};
