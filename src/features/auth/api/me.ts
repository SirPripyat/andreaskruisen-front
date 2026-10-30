import type { UserRole } from '@/features/admin/users';
import { api } from '@/lib';

export type Me = {
  id: string;
  name: string;
  role: UserRole;
};

export async function getMe() {
  const { data } = await api.get<Me>('/auth/me');
  return data;
}
