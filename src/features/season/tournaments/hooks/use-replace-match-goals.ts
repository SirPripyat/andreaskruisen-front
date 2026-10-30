import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ReplaceMatchGoalsPayload } from '../api';
import { replaceMatchGoals } from '../api';

export function useReplaceMatchGoals(
  tournamentId: string | undefined,
  matchId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReplaceMatchGoalsPayload) =>
      replaceMatchGoals(tournamentId as string, matchId as string, payload),
    meta: { errorMessage: 'Não foi possível registrar o placar.' },
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
