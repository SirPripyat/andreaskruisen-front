import { api } from '@/lib';
import type { Tournament } from './tournament';

export const listTournaments = async (seasonId: string) => {
  const { data } = await api.get<Tournament[]>(
    `/seasons/${seasonId}/tournaments`,
  );
  return data;
};
