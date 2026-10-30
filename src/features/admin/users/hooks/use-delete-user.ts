import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../api';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    meta: { errorMessage: 'Não foi possível excluir o usuário.' },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
