import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../api';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    meta: { errorMessage: 'Não foi possível criar o usuário.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
