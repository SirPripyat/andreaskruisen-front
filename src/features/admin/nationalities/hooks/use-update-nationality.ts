import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import type { UpdateNationalityPayload } from '../api';
import { updateNationality } from '../api';

export const useUpdateNationality = (nationalityId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateNationalityPayload) =>
      updateNationality(nationalityId as string, payload),
    meta: { errorMessage: 'Não foi possível atualizar a nacionalidade.' },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.nationalities.detail(nationalityId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.nationalities.all });
    },
  });
};
