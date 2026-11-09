import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelectedSeason } from '@/features/admin/seasons';
import type { CreateTournamentPayload } from '../api';
import { createTournament } from '../api';

export const useCreateTournament = () => {
  const queryClient = useQueryClient();
  const { selectedSeason } = useSelectedSeason();

  return useMutation({
    mutationFn: (payload: CreateTournamentPayload) => createTournament(payload),
    meta: { errorMessage: 'Não foi possível criar o torneio.' },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tournaments', selectedSeason?.id],
      });
    },
  });
};
