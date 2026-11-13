import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { listTournaments } from '../api';

export const useTournaments = () => {
  return useQuery({
    queryKey: queryKeys.tournaments.all,
    queryFn: () => listTournaments(),
  });
};
