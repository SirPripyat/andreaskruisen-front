import type { Season } from '@/features/admin/seasons/types';
import { api } from '@/lib';

export const getMyActiveSeason = () =>
  api.get<Season>('/me/active-season').then((data) => data.data);
