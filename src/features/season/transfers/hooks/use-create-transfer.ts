import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateTransferPayload } from '../api';
import { createTransfer } from '../api';

export const useCreateTransfer = (seasonId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransferPayload) =>
      createTransfer(seasonId as string, payload),
    meta: { errorMessage: 'Não foi possível registrar a transferência.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers', seasonId] });
    },
  });
};
