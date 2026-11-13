import type { MatchListItem } from '../../types';

export type MatchStatus = {
  played: boolean;
  homeWinner: boolean;
  awayWinner: boolean;
  locked: boolean;
};

export const getMatchStatus = (match: MatchListItem): MatchStatus => {
  const played = match.homeScore !== null && match.awayScore !== null;
  const tied = played && match.homeScore === match.awayScore;

  // Empate no tempo normal de uma eliminatória é decidido nos pênaltis — o
  // placar principal continua igual, então quem avançou vem de `penalties`.
  if (tied && match.penalties) {
    return {
      played,
      homeWinner: match.penalties.winnerTeamId === match.homeTeam.id,
      awayWinner: match.penalties.winnerTeamId === match.awayTeam.id,
      locked: match.locked,
    };
  }

  return {
    played,
    homeWinner:
      played && (match.homeScore as number) > (match.awayScore as number),
    awayWinner:
      played && (match.awayScore as number) > (match.homeScore as number),
    locked: match.locked,
  };
};
