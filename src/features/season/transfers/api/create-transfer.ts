import { api } from '@/lib';
import type { CreateTransferPayload } from './schema';
import type { Transfer } from './transfer';

export const createTransfer = async (payload: CreateTransferPayload) => {
  const { data } = await api.post<Transfer>('/transfers', payload);
  return data;
};
