import { api } from '@/lib';

export async function deleteSeason(seasonId: string) {
  await api.delete(`/seasons/${seasonId}`);
}
