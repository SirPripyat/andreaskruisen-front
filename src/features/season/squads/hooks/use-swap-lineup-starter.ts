import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { swapLineupStarter } from '../api';

export const useSwapLineupStarter = (teamId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      starterOutId,
      benchInId,
    }: {
      starterOutId: string;
      benchInId: string;
    }) =>
      swapLineupStarter({ teamId: teamId as string, starterOutId, benchInId }),
    meta: { errorMessage: 'Não foi possível atualizar a escalação.' },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lineup.detail(teamId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.roster.detail(teamId),
      });
    },
  });
};
