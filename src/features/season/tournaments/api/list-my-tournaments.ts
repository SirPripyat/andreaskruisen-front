import { api } from '@/lib';
import type { MyTournament } from '../types';

export const listMyTournaments = () =>
  api.get<MyTournament[]>('/tournaments/mine').then((res) => res.data);
