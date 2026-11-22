import { useMemo } from 'react';
import { useTournament } from './use-tournament';
import { useTournamentAllMatches } from './use-tournament-all-matches';

export type LeagueProgress = {
  currentRound: number;
  totalRounds: number;
  playedMatches: number;
  totalMatches: number;
};

// Liga é uma fase única — "rodada atual" não vem de nenhum campo da API,
// é inferida a partir do maior `round` entre as partidas já disputadas.
export const useLeagueProgress = (
  tournamentId: string | undefined,
): LeagueProgress | null => {
  const { data: tournament } = useTournament(tournamentId);
  const { phases } = useTournamentAllMatches(tournamentId);

  return useMemo(() => {
    if (tournament?.format !== 'LEAGUE') return null;

    const matches = phases.flatMap(({ matches }) => matches);
    if (matches.length === 0) return null;

    const totalRounds = Math.max(...matches.map((match) => match.round ?? 0));
    const playedMatches = matches.filter((match) => match.homeScore !== null);
    const currentRound = playedMatches.reduce(
      (max, match) => Math.max(max, match.round ?? 0),
      0,
    );

    return {
      currentRound,
      totalRounds,
      playedMatches: playedMatches.length,
      totalMatches: matches.length,
    };
  }, [tournament, phases]);
};
