import { api } from '@/lib';
import type { User } from './user';

export async function listUsers() {
  const { data } = await api.get<User[]>('/users');
  return data;
}
