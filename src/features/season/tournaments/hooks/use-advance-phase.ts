import { useMutation, useQueryClient } from '@tanstack/react-query';
import { advancePhase } from '../api';

export function useAdvancePhase(tournamentId: string | undefined) {
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
        queryKey: ['tournament', tournamentId],
      });
    },
  });
}
