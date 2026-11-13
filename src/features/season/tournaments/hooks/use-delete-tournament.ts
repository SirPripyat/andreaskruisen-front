import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { deleteTournament } from '../api';

export const useDeleteTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tournamentId: string) => deleteTournament(tournamentId),
    meta: { errorMessage: 'Não foi possível excluir o torneio.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tournaments.all });
    },
  });
};
