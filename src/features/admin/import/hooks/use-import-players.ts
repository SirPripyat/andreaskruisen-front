import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { importPlayers } from '../../players/api';

export const useImportPlayers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importPlayers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.players.all });
    },
  });
};
