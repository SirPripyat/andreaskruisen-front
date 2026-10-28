import { useMutation } from '@tanstack/react-query';
import { login } from '../api';

export function useLogin() {
  return useMutation({
    mutationFn: login,
    meta: { errorMessage: 'Não foi possível entrar. Tente novamente.' },
  });
}
