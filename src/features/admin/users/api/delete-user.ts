import { api } from '@/lib';

export const deleteUser = async (userId: string) => {
  await api.delete(`/users/${userId}`);
};
