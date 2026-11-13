import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { listPlayers } from '../api';
import type { ListPlayersQuery } from '../types';

export const usePlayers = (query: ListPlayersQuery) => {
  return useQuery({
    queryKey: queryKeys.players.list(query),
    queryFn: () => listPlayers(query),
    placeholderData: (previousData) => previousData,
  });
};
