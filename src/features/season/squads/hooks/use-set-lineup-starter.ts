import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PositionCode } from '@/features/admin/players';
import { queryKeys } from '@/lib';
import { setLineupStarter } from '../api';

export const useSetLineupStarter = (teamId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      playerId,
      isStarter,
      position,
    }: {
      playerId: string;
      isStarter: boolean;
      position?: PositionCode;
    }) =>
      setLineupStarter({
        teamId: teamId as string,
        playerId,
        isStarter,
        position,
      }),
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
