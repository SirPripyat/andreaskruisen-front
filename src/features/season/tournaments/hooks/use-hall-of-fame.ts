import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getHallOfFame } from '../api';
import type { TournamentFormat } from '../types';

export const useHallOfFame = (format: TournamentFormat) => {
  return useQuery({
    queryKey: queryKeys.tournaments.hallOfFame(format),
    queryFn: () => getHallOfFame(format),
  });
};
