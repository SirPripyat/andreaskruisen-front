import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { listClubs } from '../api';
import type { ListClubsQuery } from '../types';

export const useClubsInfinite = (query: Omit<ListClubsQuery, 'page'>) => {
  return useInfiniteQuery({
    queryKey: queryKeys.clubsInfinite(query),
    queryFn: ({ pageParam }) => listClubs({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
};
