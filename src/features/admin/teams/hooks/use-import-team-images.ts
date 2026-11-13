import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { importTeamImages } from '../api';

export const useImportTeamImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importTeamImages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.all });
    },
  });
};
