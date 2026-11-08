import { api } from '@/lib';
import type { TournamentSituation } from './tournament';

export const getTournamentSituation = async (
  tournamentId: string,
  query?: { onlyOwnedTeams?: boolean; round?: number },
) => {
  const { data } = await api.get<TournamentSituation>(
    `/tournaments/${tournamentId}/situation`,
    { params: query },
  );
  return data;
};
