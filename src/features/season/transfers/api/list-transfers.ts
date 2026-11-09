import { api } from '@/lib';
import type { Transfer } from './transfer';

export const listTransfers = async () => {
  const { data } = await api.get<Transfer[]>('/transfers');
  return data;
};
