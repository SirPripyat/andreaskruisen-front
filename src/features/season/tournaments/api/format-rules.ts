import type { GroupStageConfig, TournamentFormat } from '../types/tournament';

type TeamCountRule = {
  allowed: number[];
};

// Espelha src/tournaments/utils/tournament-format-rules.utils.ts no backend:
// liga e mata-mata aceitam só uma lista fixa de valores. GROUP_STAGE_KNOCKOUT
// não tem lista fixa — groupSize/qualifiersPerGroup/quantidade de grupos são
// escolhidos livremente (ver GroupStageConfigFields), e a validação é feita
// por isValidGroupStageSetup.
export const TEAM_COUNT_RULES: Record<'LEAGUE' | 'KNOCKOUT', TeamCountRule> = {
  LEAGUE: { allowed: [4, 8, 12, 16, 20, 24] },
  KNOCKOUT: { allowed: [2, 4, 8, 16, 32, 64] },
};

export const isValidMaxTeams = (
  format: 'LEAGUE' | 'KNOCKOUT',
  maxTeams: number,
): boolean => TEAM_COUNT_RULES[format].allowed.includes(maxTeams);

export const isValidGroupStageSetup = (
  maxTeams: number,
  config: Pick<GroupStageConfig, 'groupSize' | 'qualifiersPerGroup'>,
): boolean => {
  if (config.groupSize < 2) return false;
  if (config.qualifiersPerGroup < 1) return false;
  if (config.qualifiersPerGroup > config.groupSize) return false;
  if (maxTeams % config.groupSize !== 0) return false;

  const groupsCount = maxTeams / config.groupSize;
  const classifiedCount = groupsCount * config.qualifiersPerGroup;

  // Não precisa ser potência de 2: quando o total de classificados não
  // fecha um bracket "redondo", o backend completa com bye (time que avança
  // sem jogar) até a próxima potência de 2 — ver nextPowerOfTwo.
  return classifiedCount >= 2;
};

// Menor potência de 2 maior ou igual a n — tamanho do bracket de mata-mata
// que acomoda n classificados, completando o resto com bye.
export const nextPowerOfTwo = (n: number): number => {
  let power = 1;
  while (power < n) power *= 2;
  return power;
};

// Liga não tem fase seguinte pra avançar (uma única fase cobre toda a
// competição) e mata-mata/híbrido nunca avançam além da Final — em ambos os
// casos não existe próxima fase: essa é a decisiva, onde "Finalizar torneio"
// substitui "Avançar fase".
export const isDecisivePhase = (
  format: TournamentFormat,
  phaseName: string | null | undefined,
): boolean => format === 'LEAGUE' || phaseName === 'Final';
