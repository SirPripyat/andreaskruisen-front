import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelectedSeason } from '@/features/admin/seasons';
import type { CreateTransferPayload } from '../api';
import { createTransfer } from '../api';

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();
  const { selectedSeason } = useSelectedSeason();

  return useMutation({
    mutationFn: (payload: CreateTransferPayload) => createTransfer(payload),
    meta: { errorMessage: 'Não foi possível registrar a transferência.' },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transfers', selectedSeason?.id],
      });
    },
  });
};
