import { api } from '@/lib';
import type { TournamentSummary } from './tournament';

export const getTournament = async (tournamentId: string) => {
  const { data } = await api.get<TournamentSummary>(
    `/tournaments/${tournamentId}`,
  );
  return data;
};
