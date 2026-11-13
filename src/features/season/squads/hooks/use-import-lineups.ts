import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { importLineups } from '../api';

export const useImportLineups = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importLineups,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lineup.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.roster.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.team.all });
    },
  });
};
