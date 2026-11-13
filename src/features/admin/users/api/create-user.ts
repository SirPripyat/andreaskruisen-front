import { api } from '@/lib';
import type { CreateUserPayload } from '../types';

export const createUser = (payload: CreateUserPayload) =>
  api.post('/users', payload);
