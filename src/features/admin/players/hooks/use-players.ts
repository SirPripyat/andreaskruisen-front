import { useQuery } from '@tanstack/react-query';
import type { ListPlayersQuery } from '../api';
import { listPlayers } from '../api';

export function usePlayers(query: ListPlayersQuery) {
  return useQuery({
    queryKey: ['players', query],
    queryFn: () => listPlayers(query),
    placeholderData: (previousData) => previousData,
  });
}
