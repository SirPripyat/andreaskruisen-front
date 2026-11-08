import { api } from '@/lib';

export const deleteSeason = async (seasonId: string) => {
  await api.delete(`/seasons/${seasonId}`);
};
