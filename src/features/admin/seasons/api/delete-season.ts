import { api } from '@/lib';

export const deleteSeason = (seasonId: string) =>
  api.delete(`/seasons/${seasonId}`);
