import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import type { UpdateSeasonPayload } from '../api';
import { updateSeason } from '../api';

export const useUpdateSeason = (seasonId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSeasonPayload) =>
      updateSeason(seasonId as string, payload),
    meta: { errorMessage: 'Não foi possível atualizar a temporada.' },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.seasons.detail(seasonId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.seasons.all });
    },
  });
};
