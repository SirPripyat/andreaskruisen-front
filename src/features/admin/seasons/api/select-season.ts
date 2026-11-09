import type { Me } from '@/features/auth';
import { api } from '@/lib';

export const selectSeason = async (seasonId: string) => {
  const { data } = await api.patch<Me>('/users/me/selected-season', {
    seasonId,
  });
  return data;
};
