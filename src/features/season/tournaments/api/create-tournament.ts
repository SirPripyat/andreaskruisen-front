import { api } from '@/lib';
import type { CreateTournamentPayload } from './schema';
import type { Tournament } from './tournament';

export async function createTournament(
  seasonId: string,
  payload: CreateTournamentPayload,
) {
  const { data } = await api.post<Tournament>(
    `/seasons/${seasonId}/tournaments`,
    payload,
  );
  return data;
}
