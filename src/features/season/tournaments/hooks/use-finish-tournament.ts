import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { finishTournament } from '../api';

export const useFinishTournament = (tournamentId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => finishTournament(tournamentId as string),
    meta: { errorMessage: 'Não foi possível finalizar o torneio.' },
    onSuccess: () => {
      // Trava todas as partidas do torneio contra edição — invalida tudo
      // que é prefixado por ['tournament', id] (matches, situation,
      // `finishedAt`, `locked`...) de uma vez.
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournaments.detail(tournamentId),
      });
    },
  });
};
