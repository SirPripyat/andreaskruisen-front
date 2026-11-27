import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib';
import { getTournamentGroup } from '../api';

// A fase de grupos é sempre a primeira do torneio (ver buildFirstPhase no
// back) — por isso o `round` (Phase.order) fica fixo aqui, igual ao que
// TournamentGroupStandings faz pra classificação final.
const GROUP_PHASE_ORDER = 1;

export const useTournamentGroup = (
  tournamentId: string | undefined,
  groupLabel: string | undefined,
) => {
  return useQuery({
    queryKey: queryKeys.tournaments.group(tournamentId, groupLabel, {
      round: GROUP_PHASE_ORDER,
    }),
    queryFn: () =>
      getTournamentGroup(tournamentId as string, groupLabel as string, {
        round: GROUP_PHASE_ORDER,
      }),
    enabled: !!tournamentId && !!groupLabel,
  });
};
