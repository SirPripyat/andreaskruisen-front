import { api } from '@/lib';
import type { CreateTransferPayload } from './schema';
import type { Transfer } from './transfer';

export const createTransfer = async (
  seasonId: string,
  payload: CreateTransferPayload,
) => {
  const { data } = await api.post<Transfer>(
    `/seasons/${seasonId}/transfers`,
    payload,
  );
  return data;
};
