import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateTournamentPayload } from '../api';
import { updateTournament } from '../api';

export function useUpdateTournament(tournamentId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTournamentPayload) =>
      updateTournament(tournamentId as string, payload),
    meta: { errorMessage: 'Não foi possível atualizar o torneio.' },
    onSuccess: (tournament) => {
      queryClient.invalidateQueries({
        queryKey: ['tournament', tournamentId],
      });
      queryClient.invalidateQueries({
        queryKey: ['tournaments', tournament.seasonId],
      });
    },
  });
}
