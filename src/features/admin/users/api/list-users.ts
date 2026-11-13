import { api } from '@/lib';
import type { User } from '../types';

export const listUsers = () =>
  api.get<User[]>('/users').then((data) => data.data);
