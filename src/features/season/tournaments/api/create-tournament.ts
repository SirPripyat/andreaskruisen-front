import { api } from '@/lib';
import type { CreateTournamentPayload } from './schema';
import type { Tournament } from './tournament';

export const createTournament = async (payload: CreateTournamentPayload) => {
  const { data } = await api.post<Tournament>('/tournaments', payload);
  return data;
};
