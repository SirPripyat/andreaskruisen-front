import { api } from '@/lib';
import type { TournamentDashboard } from './tournament';

export const getTournamentDashboard = async (tournamentId: string) => {
  const { data } = await api.get<TournamentDashboard>(
    `/tournaments/${tournamentId}/dashboard`,
  );
  return data;
};
