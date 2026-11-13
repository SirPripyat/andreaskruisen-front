import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { removeFavorite } from '../api';

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavorite,
    meta: { errorMessage: 'Não foi possível remover o jogador dos favoritos.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
      queryClient.invalidateQueries({ queryKey: queryKeys.seasonPlayers.all });
    },
  });
};
