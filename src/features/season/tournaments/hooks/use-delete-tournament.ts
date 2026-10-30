import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTournament } from '../api';

export function useDeleteTournament(seasonId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tournamentId: string) => deleteTournament(tournamentId),
    meta: { errorMessage: 'Não foi possível excluir o torneio.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments', seasonId] });
    },
  });
}
