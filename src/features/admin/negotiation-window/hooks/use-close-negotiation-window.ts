import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { closeNegotiationWindow } from '../api';

export const useCloseNegotiationWindow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeNegotiationWindow,
    meta: { errorMessage: 'Não foi possível fechar a janela de negociação.' },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.negotiationWindow.status,
      });
    },
  });
};
