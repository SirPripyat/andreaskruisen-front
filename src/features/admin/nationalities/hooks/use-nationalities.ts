import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { listNationalities } from '../api';
import type { ListNationalitiesQuery } from '../types';

export const useNationalities = (query: ListNationalitiesQuery) => {
  return useQuery({
    queryKey: queryKeys.nationalities.list(query),
    queryFn: () => listNationalities(query),
    placeholderData: (previousData) => previousData,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
