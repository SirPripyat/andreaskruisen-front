import { api } from '@/lib';
import type { TournamentSituation } from './tournament';

export async function getTournamentSituation(
  tournamentId: string,
  // `round` é a ordem da fase (Phase.order), não um número de rodada dentro
  // dela — mesmo nome usado em getTournamentMatches. Sem ele, o back usa a
  // fase vigente do torneio.
  query?: { onlyOwnedTeams?: boolean; round?: number },
) {
  const { data } = await api.get<TournamentSituation>(
    `/tournaments/${tournamentId}/situation`,
    { params: query },
  );
  return data;
}
