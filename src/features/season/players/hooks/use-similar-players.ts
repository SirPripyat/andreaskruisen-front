import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getSimilarPlayers } from '../api';

export const useSimilarPlayers = (id: string | undefined, limit?: number) => {
  return useQuery({
    queryKey: queryKeys.seasonPlayers.similar(id, limit),
    queryFn: () => getSimilarPlayers(id as string, limit),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
