import { api } from '@/lib';
import type { CreateTransferPayload, Transfer } from '../types';

export const createTransfer = (payload: CreateTransferPayload) =>
  api.post<Transfer>('/transfers', payload).then((res) => res.data);
