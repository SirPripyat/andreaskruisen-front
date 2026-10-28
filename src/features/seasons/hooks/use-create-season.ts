import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSeason } from '../api';

export function useCreateSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSeason,
    meta: { errorMessage: 'Não foi possível criar a temporada.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
    },
  });
}
