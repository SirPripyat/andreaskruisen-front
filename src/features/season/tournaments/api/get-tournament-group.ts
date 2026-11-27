import { api } from '@/lib';
import type { TournamentGroupSituation } from '../types';

export const getTournamentGroup = (
  tournamentId: string,
  groupLabel: string,
  query?: { round?: number },
) =>
  api
    .get<TournamentGroupSituation>(
      `/tournaments/${tournamentId}/groups/${groupLabel}`,
      { params: query },
    )
    .then((res) => res.data);
