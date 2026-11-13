import { api } from '@/lib';
import type { Season } from '../types';

export const getSeason = (id: string) =>
  api.get<Season>(`/seasons/${id}`).then((res) => res.data);
