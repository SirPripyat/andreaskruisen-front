import { api } from '@/lib';

export async function deleteUser(userId: string) {
  await api.delete(`/users/${userId}`);
}
