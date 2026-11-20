import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { openNegotiationWindow } from '../api';

export const useOpenNegotiationWindow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: openNegotiationWindow,
    meta: { errorMessage: 'Não foi possível abrir a janela de negociação.' },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.negotiationWindow.status,
      });
    },
  });
};
