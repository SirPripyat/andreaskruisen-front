import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { deleteSeason } from '../api';

export const useDeleteSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (seasonId: string) => deleteSeason(seasonId),
    meta: { errorMessage: 'Não foi possível excluir a temporada.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.seasons.all });
    },
  });
};
