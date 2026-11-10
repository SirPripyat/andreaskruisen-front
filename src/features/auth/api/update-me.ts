import { api } from '@/lib';
import type { Me } from './me';

export type UpdateMePayload = {
  name: string;
  pin?: string;
};

export const updateMe = async (payload: UpdateMePayload) => {
  const { data } = await api.patch<Me>('/users/me', payload);
  return data;
};
