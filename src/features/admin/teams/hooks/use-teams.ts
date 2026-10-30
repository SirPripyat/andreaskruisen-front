import { useQuery } from '@tanstack/react-query';
import type { ListTeamsQuery } from '../api';
import { listTeams } from '../api';

export function useTeams(query: ListTeamsQuery) {
  return useQuery({
    queryKey: ['teams', query],
    queryFn: () => listTeams(query),
    placeholderData: (previousData) => previousData,
  });
}
