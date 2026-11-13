import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { advancePhase } from '../api';

export const useAdvancePhase = (tournamentId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (phaseId: string) =>
      advancePhase(tournamentId as string, phaseId),
    meta: { errorMessage: 'Não foi possível avançar a fase.' },
    onSuccess: () => {
      // Gera a próxima fase e trava as partidas da atual — invalida tudo
      // que é prefixado por ['tournament', id] (matches, situation,
      // currentPhase, `locked`...) de uma vez.
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournaments.detail(tournamentId),
      });
    },
  });
};
