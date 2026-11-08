import { useMutation, useQueryClient } from '@tanstack/react-query';
import { selectSeason } from '../api';

export const useSelectSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: selectSeason,
    meta: { errorMessage: 'Não foi possível trocar a temporada.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
    },
  });
};
