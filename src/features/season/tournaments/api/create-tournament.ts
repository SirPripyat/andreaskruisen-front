import { api } from '@/lib';
import type { CreateTournamentPayload, Tournament } from '../types';

export const createTournament = (payload: CreateTournamentPayload) =>
  api.post<Tournament>('/tournaments', payload).then((res) => res.data);
