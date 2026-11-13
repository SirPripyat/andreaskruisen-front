import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getTournament } from '../api';

export const useTournament = (
  tournamentId: string | undefined,
  open: boolean = true,
) => {
  return useQuery({
    queryKey: queryKeys.tournaments.detail(tournamentId),
    queryFn: () => getTournament(tournamentId as string),
    enabled: open && !!tournamentId,
  });
};
