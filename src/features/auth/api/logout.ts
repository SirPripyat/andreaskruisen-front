import { api } from '@/lib';

export const logout = async () => {
  await api.post('/auth/logout');
};
