import { api } from '@/lib';
import type { CreateTournamentPayload } from './schema';
import type { Tournament } from './tournament';

export const createTournament = async (
  seasonId: string,
  payload: CreateTournamentPayload,
) => {
  const { data } = await api.post<Tournament>(
    `/seasons/${seasonId}/tournaments`,
    payload,
  );
  return data;
};
