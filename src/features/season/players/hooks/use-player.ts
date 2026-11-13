import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getPlayer } from '../api';

export const usePlayer = (id: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.seasonPlayers.detail(id),
    queryFn: () => getPlayer(id as string),
    enabled: !!id,
  });
};
