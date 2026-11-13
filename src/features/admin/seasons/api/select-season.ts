import type { Me } from '@/features/auth';
import { api } from '@/lib';

export const selectSeason = (seasonId: string) =>
  api
    .patch<Me>('/me/selected-season', {
      seasonId,
    })
    .then((data) => data.data);
