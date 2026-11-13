import { api } from '@/lib';
import type { Nationality } from '../types';

export const getNationality = (id: string) =>
  api.get<Nationality>(`/nationalities/${id}`).then((res) => res.data);
