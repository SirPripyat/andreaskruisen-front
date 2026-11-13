import { api } from '@/lib';
import type { Season } from '../types';

export const listSeasons = () =>
  api.get<Season[]>('/seasons').then((data) => data.data);
