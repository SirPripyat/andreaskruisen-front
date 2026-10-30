import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateTournamentPayload } from '../api';
import { createTournament } from '../api';

export function useCreateTournament(seasonId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTournamentPayload) =>
      createTournament(seasonId as string, payload),
    meta: { errorMessage: 'Não foi possível criar o torneio.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', seasonId] });
    },
  });
}
