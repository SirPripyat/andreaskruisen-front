import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { createTournament } from '../api';
import type { CreateTournamentPayload } from '../types';

export const useCreateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTournamentPayload) => createTournament(payload),
    meta: { errorMessage: 'Não foi possível criar o torneio.' },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournaments.all,
      });
    },
  });
};
