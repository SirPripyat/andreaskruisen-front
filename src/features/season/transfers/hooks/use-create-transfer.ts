import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { createTransfer } from '../api';
import type { CreateTransferPayload } from '../types';

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransferPayload) => createTransfer(payload),
    meta: { errorMessage: 'Não foi possível registrar a transferência.' },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.transfers,
      });
    },
  });
};
