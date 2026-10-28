import { api } from '@/lib';
import type { UserRole } from '../../users';

export type Me = {
  id: string;
  name: string;
  role: UserRole;
};

export async function getMe() {
  const { data } = await api.get<Me>('/auth/me');
  return data;
}
