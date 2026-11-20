import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { listTeamsPublic } from '../api';
import type { ListTeamsQuery } from '../types';

export const useTeamsPublic = (query: ListTeamsQuery) => {
  return useQuery({
    queryKey: queryKeys.teamsPublic.list(query),
    queryFn: () => listTeamsPublic(query),
    placeholderData: (previousData) => previousData,
  });
};
