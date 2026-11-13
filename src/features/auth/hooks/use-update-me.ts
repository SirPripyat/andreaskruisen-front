import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { updateMe } from '../api';

export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    meta: { errorMessage: 'Não foi possível atualizar o perfil.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me.detail });
    },
  });
};
