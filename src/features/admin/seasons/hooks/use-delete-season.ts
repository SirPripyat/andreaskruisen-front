import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSeason } from '../api';

export function useDeleteSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (seasonId: string) => deleteSeason(seasonId),
    meta: { errorMessage: 'Não foi possível excluir a temporada.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
    },
  });
}
