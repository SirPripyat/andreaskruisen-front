import { api } from '@/lib';
import type { LoginFormValues } from '../types';
import type { Me } from './me';

export type LoginResponse = {
  user: Me;
  token: string;
};

export const login = (payload: LoginFormValues) =>
  api.post<LoginResponse>('/auth/login', payload).then((res) => res.data);
