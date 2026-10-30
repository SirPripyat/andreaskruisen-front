import { api } from '@/lib';
import type { Transfer } from './transfer';

export async function listTransfers(seasonId: string) {
  const { data } = await api.get<Transfer[]>(`/seasons/${seasonId}/transfers`);
  return data;
}
