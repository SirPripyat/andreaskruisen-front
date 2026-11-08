import { useMutation, useQueryClient } from '@tanstack/react-query';
import { importLineups } from '../api';

export const useImportLineups = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importLineups,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lineup'] });
      queryClient.invalidateQueries({ queryKey: ['roster'] });
      queryClient.invalidateQueries({ queryKey: ['team'] });
    },
  });
};
