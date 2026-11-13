import { api } from '@/lib';
import type { Transfer } from '../types';

export const listTransfers = () =>
  api.get<Transfer[]>('/transfers').then((res) => res.data);
