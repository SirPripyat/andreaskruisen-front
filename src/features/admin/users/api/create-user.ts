import { api } from '@/lib';
import type { CreateUserPayload } from './schema';

export async function createUser(payload: CreateUserPayload) {
  await api.post('/users', payload);
}
