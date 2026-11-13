import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { listTeams } from '../api';
import type { ListTeamsQuery } from '../types';

export const useTeams = (query: ListTeamsQuery) => {
  return useQuery({
    queryKey: queryKeys.teams.list(query),
    queryFn: () => listTeams(query),
    placeholderData: (previousData) => previousData,
  });
};
