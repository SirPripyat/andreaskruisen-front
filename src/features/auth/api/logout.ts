import { api } from '@/lib';

export async function logout() {
  await api.post('/auth/logout');
}
