import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { simulateMatchesBulk } from '../api';

export const useSimulateMatchesBulk = (tournamentId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchIds: string[]) => simulateMatchesBulk(matchIds),
    meta: { errorMessage: 'Não foi possível simular as partidas.' },
    onSuccess: () => {
      // Mesma invalidação do simulate individual — cobre matches, situation
      // e `locked`/`currentPhase` de uma vez só, mesmo tendo simulado várias.
      queryClient.invalidateQueries({
        queryKey: queryKeys.tournaments.detail(tournamentId),
      });
    },
  });
};
