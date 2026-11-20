import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { rejectNegotiation } from '../api';

export const useRejectNegotiation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rejectNegotiation(id),
    meta: { errorMessage: 'Não foi possível rejeitar a negociação.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.negotiations.all });
    },
  });
};
