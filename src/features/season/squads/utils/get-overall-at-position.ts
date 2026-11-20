import type { RosterPlayer } from '../types';

// Overall do jogador NA posição dada (slot que ocupa no campo, ou posição
// atual se ainda tá no banco) em vez do overallRating genérico — cai pra
// ele só se não houver rating específico pra essa posição no grid SoFIFA.
export const getOverallAtPosition = (
  player: RosterPlayer,
  position: string,
): number => {
  const rating = player.positionRatings.find(
    (item) => item.position === position,
  );

  return rating?.overall ?? player.overallRating;
};
