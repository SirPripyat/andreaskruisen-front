import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { acceptNegotiation } from '../api';

export const useAcceptNegotiation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => acceptNegotiation(id),
    meta: { errorMessage: 'Não foi possível aceitar a negociação.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.negotiations.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transfers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.roster.all });
    },
  });
};
