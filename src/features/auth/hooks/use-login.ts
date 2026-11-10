import { useMutation } from '@tanstack/react-query';
import { useAuthStore, useUserStore } from '@/stores';
import { login } from '../api';

export const useLogin = () => {
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useUserStore((s) => s.setUser);

  return useMutation({
    mutationFn: login,
    meta: { errorMessage: 'Não foi possível entrar. Tente novamente.' },
    onSuccess: (data) => {
      setToken(data.token);
      setUser({
        name: data.user.name,
        role: data.user.role,
        selectedSeasonId: data.user.selectedSeasonId,
      });
    },
  });
};
