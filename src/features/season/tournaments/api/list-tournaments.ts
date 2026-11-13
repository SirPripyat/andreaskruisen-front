import { api } from '@/lib';
import type { Tournament } from '../types';

export const listTournaments = () =>
  api.get<Tournament[]>('/tournaments').then((res) => res.data);
