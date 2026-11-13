import { api } from '@/lib';
import type { TournamentSituation } from '../types';

export const getTournamentSituation = (
  tournamentId: string,
  query?: { onlyOwnedTeams?: boolean; round?: number },
) =>
  api
    .get<TournamentSituation>(`/tournaments/${tournamentId}/situation`, {
      params: query,
    })
    .then((res) => res.data);
