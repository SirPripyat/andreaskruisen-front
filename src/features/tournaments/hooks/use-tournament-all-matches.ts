import { useQueries } from '@tanstack/react-query';
import type {
  ListTournamentMatchesQuery,
  MatchListItem,
  PhaseSummary,
} from '../api';
import { getTournamentMatches } from '../api';

export type MatchesByPhase = {
  phase: PhaseSummary;
  matches: MatchListItem[];
};

// Cada fase do torneio (grupos, depois mata-mata) é paginada separadamente
// no back (ver getTournamentMatches/round = Phase.order). Pra não perder o
// histórico das fases já concluídas quando uma nova começa, buscamos todas
// elas (1 a `phaseCount`, a fase vigente) e juntamos aqui.
export function useTournamentAllMatches(
  tournamentId: string | undefined,
  phaseCount: number,
  pageSize: number,
): { phases: MatchesByPhase[]; isPending: boolean } {
  const orders = Array.from(
    { length: Math.max(phaseCount, 0) },
    (_, index) => index + 1,
  );

  const results = useQueries({
    queries: orders.map((round) => {
      const query: ListTournamentMatchesQuery = { round, page: 1, pageSize };
      return {
        queryKey: ['tournament', tournamentId, 'matches', query],
        queryFn: () => getTournamentMatches(tournamentId as string, query),
        enabled: !!tournamentId,
      };
    }),
  });

  const phases: MatchesByPhase[] = [];
  for (const result of results) {
    if (result.data) {
      phases.push({ phase: result.data.phase, matches: result.data.data });
    }
  }

  return {
    phases,
    isPending: results.some((result) => result.isPending),
  };
}
