import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import type { UpdateTeamPayload } from '../api';
import { updateTeam } from '../api';

export const useUpdateTeam = (teamId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTeamPayload) =>
      updateTeam(teamId as string, payload),
    meta: { errorMessage: 'Não foi possível atualizar o time.' },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.team.detail(teamId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.all });
    },
  });
};
