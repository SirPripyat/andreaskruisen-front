import { api } from '@/lib';
import type { LoginFormValues } from './schema';

export async function login(payload: LoginFormValues) {
  await api.post('/auth/login', payload);
}
