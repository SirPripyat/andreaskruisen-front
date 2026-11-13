import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { listClubs } from '../api';
import type { ListClubsQuery } from '../types';

export const useClubs = (query: ListClubsQuery) => {
  return useQuery({
    queryKey: queryKeys.clubs(query),
    queryFn: () => listClubs(query),
    placeholderData: (previousData) => previousData,
  });
};
