import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { importFcmPlayers } from '../../players/api';

export const useImportFcmPlayers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importFcmPlayers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.players.all });
    },
  });
};
