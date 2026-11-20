import { api } from '@/lib';
import type { Tournament } from '../types';

export const getTournament = (tournamentId: string) =>
  api.get<Tournament>(`/tournaments/${tournamentId}`).then((res) => res.data);
