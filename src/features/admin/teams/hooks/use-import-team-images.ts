import { useMutation, useQueryClient } from '@tanstack/react-query';
import { importTeamImages } from '../api';

export const useImportTeamImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importTeamImages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};
