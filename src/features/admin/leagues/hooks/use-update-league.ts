import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import type { UpdateLeaguePayload } from '../api';
import { updateLeague } from '../api';

export const useUpdateLeague = (leagueId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLeaguePayload) =>
      updateLeague(leagueId as string, payload),
    meta: { errorMessage: 'Não foi possível atualizar a liga.' },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.leagues.detail(leagueId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.leagues.all });
    },
  });
};
