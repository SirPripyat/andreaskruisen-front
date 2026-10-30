import { useMemo } from 'react';
import type { BracketRound } from './use-bracket-connectors';
import { useTournamentAllMatches } from './use-tournament-all-matches';

// O chaveamento usa os placares reais das partidas (ver MatchListItem), ao
// contrário do confronto "cru" da situação — e cobre todas as rodadas de
// mata-mata já geradas (quartas, semi, final...), não só a vigente.
export const useTournamentBracket = (
  tournamentId: string | undefined,
): {
  rounds: BracketRound[];
  isPending: boolean;
} => {
  const { phases, isPending } = useTournamentAllMatches(tournamentId);

  const rounds = useMemo(
    () => phases.filter(({ phase }) => phase.type === 'KNOCKOUT'),
    [phases],
  );

  return { rounds, isPending };
};
