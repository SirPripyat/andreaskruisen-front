import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { type Formation, updateLineupFormation } from '../api';

export const useUpdateLineupFormation = (teamId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formation: Formation) =>
      updateLineupFormation({ teamId: teamId as string, formation }),
    meta: { errorMessage: 'Não foi possível atualizar a formação.' },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lineup.detail(teamId),
      });
    },
  });
};
