import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { listMyTournaments } from '../api';

export const useMyTournaments = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.tournaments.mine,
    queryFn: () => listMyTournaments(),
    enabled,
  });
};
