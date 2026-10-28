import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateSeasonPayload } from '../api';
import { updateSeason } from '../api';

export function useUpdateSeason(seasonId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSeasonPayload) =>
      updateSeason(seasonId as string, payload),
    meta: { errorMessage: 'Não foi possível atualizar a temporada.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
    },
  });
}
