import { api } from '@/lib';
import type { User } from './user';

export const listUsers = async () => {
  const { data } = await api.get<User[]>('/users');
  return data;
};
