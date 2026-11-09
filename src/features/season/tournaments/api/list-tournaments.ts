import { api } from '@/lib';
import type { Tournament } from './tournament';

export const listTournaments = async () => {
  const { data } = await api.get<Tournament[]>('/tournaments');
  return data;
};
