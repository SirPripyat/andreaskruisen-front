import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateTeamPayload } from '../api';
import { updateTeam } from '../api';

export function useUpdateTeam(teamId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTeamPayload) =>
      updateTeam(teamId as string, payload),
    meta: { errorMessage: 'Não foi possível atualizar o time.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}
