import { useQuery } from '@tanstack/react-query';
import type { ListPlayersQuery } from '@/features/admin/players';
import { queryKeys } from '@/lib';
import { listSeasonPlayers } from '../api';

export const useSeasonPlayers = (query: ListPlayersQuery) => {
  return useQuery({
    queryKey: queryKeys.seasonPlayers.list(query),
    queryFn: () => listSeasonPlayers(query),
    placeholderData: (previousData) => previousData,
  });
};
