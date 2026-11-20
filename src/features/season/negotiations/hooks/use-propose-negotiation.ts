import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { proposeNegotiation } from '../api';
import type { ProposeNegotiationPayload } from '../types';

export const useProposeNegotiation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProposeNegotiationPayload) =>
      proposeNegotiation(payload),
    meta: { errorMessage: 'Não foi possível enviar a proposta.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.negotiations.all });
    },
  });
};
