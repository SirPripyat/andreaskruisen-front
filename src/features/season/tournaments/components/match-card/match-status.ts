import type { MatchListItem } from '../../api';

export type MatchStatus = {
  played: boolean;
  homeWinner: boolean;
  awayWinner: boolean;
  locked: boolean;
};

export const getMatchStatus = (match: MatchListItem): MatchStatus => {
  const played = match.homeScore !== null && match.awayScore !== null;

  return {
    played,
    homeWinner:
      played && (match.homeScore as number) > (match.awayScore as number),
    awayWinner:
      played && (match.awayScore as number) > (match.homeScore as number),
    locked: match.locked,
  };
};
