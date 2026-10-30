import { useMutation, useQueryClient } from '@tanstack/react-query';
import { simulateMatch } from '../api';

export function useSimulateMatch(
  tournamentId: string | undefined,
  matchId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => simulateMatch(tournamentId as string, matchId as string),
    meta: { errorMessage: 'Não foi possível simular a partida.' },
    onSuccess: () => {
      // Invalida tudo que é prefixado por ['tournament', id] (matches,
      // situation, stats...) de uma vez, incluindo a chave pura (de onde
      // vem `currentPhase`/`locked`) — mais simples que listar cada chave.
      queryClient.invalidateQueries({
        queryKey: ['tournament', tournamentId],
      });
    },
  });
}
