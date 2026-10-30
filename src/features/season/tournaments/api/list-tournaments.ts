import { api } from '@/lib';
import type { Tournament } from './tournament';

export async function listTournaments(seasonId: string) {
  const { data } = await api.get<Tournament[]>(
    `/seasons/${seasonId}/tournaments`,
  );
  return data;
}
