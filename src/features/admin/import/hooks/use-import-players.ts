import { useMutation, useQueryClient } from '@tanstack/react-query';
import { importPlayers } from '../../players/api';

export function useImportPlayers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importPlayers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}
