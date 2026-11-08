import { api } from '@/lib';
import type { CreateUserPayload } from './schema';

export const createUser = async (payload: CreateUserPayload) => {
  await api.post('/users', payload);
};
