import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { addFavorite } from '../api';

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,
    meta: { errorMessage: 'Não foi possível favoritar o jogador.' },
    onSuccess: (_data, playerId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
      queryClient.invalidateQueries({ queryKey: queryKeys.seasonPlayers.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.seasonPlayers.detail(playerId),
      });
    },
  });
};
