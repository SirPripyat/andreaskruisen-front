import { api } from '@/lib';
import type { Me } from './me';
import type { LoginFormValues } from './schema';

export type LoginResponse = {
  user: Me;
  token: string;
};

export const login = async (payload: LoginFormValues) => {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  return data;
};
