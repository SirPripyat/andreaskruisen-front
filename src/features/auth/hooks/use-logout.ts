import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/stores';
import { logout } from '../api';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: logout,
    meta: { errorMessage: 'Não foi possível sair. Tente novamente.' },
    onSuccess: () => {
      setToken(null);
      queryClient.removeQueries({ queryKey: ['me'] });
      navigate('/login', { replace: true });
    },
  });
};
