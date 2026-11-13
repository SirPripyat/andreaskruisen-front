import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import type { UpdateTournamentPayload } from '../api';
import { updateTournament } from '../api';

export const useUpdateTournament = (tournamentId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTournamentPayload) =>
      updateTournament(tournamentId as string, payload),
    meta: { errorMessage: 'Não foi possível atualizar o torneio.' },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournaments.detail(tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournaments.all,
      });
    },
  });
};
