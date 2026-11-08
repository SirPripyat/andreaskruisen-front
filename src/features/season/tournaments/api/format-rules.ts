import type { TournamentFormat } from './tournament';

type TeamCountRule = {
  allowed: number[];
};

// Espelha src/tournaments/tournament-format-rules.ts no backend: todo
// formato aceita só uma lista fixa de valores (múltiplos de 4 pra liga).
export const TEAM_COUNT_RULES: Record<TournamentFormat, TeamCountRule> = {
  LEAGUE: { allowed: [4, 8, 12, 16, 20, 24] },
  KNOCKOUT: { allowed: [2, 4, 8, 16, 32, 64] },
  GROUP_STAGE_KNOCKOUT: { allowed: [4, 8, 16, 32, 64] },
};

export const isValidMaxTeams = (
  format: TournamentFormat,
  maxTeams: number,
): boolean => {
  return TEAM_COUNT_RULES[format].allowed.includes(maxTeams);
};
