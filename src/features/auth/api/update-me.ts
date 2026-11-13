import { api } from '@/lib';
import type { Me } from './me';

export type UpdateMePayload = {
  name: string;
  pin?: string;
};

export const updateMe = (payload: UpdateMePayload) =>
  api.patch<Me>('/me', payload).then((res) => res.data);
