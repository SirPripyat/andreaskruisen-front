import type { TournamentFormat } from './tournament';

type TeamCountRule = {
  min: number;
  max: number;
  // Quando ausente, qualquer valor entre min e max é aceito (ex.: liga).
  allowed?: number[];
};

// Espelha src/tournaments/tournament-format-rules.ts no backend: todo
// formato aceita só uma lista fixa de valores (múltiplos de 4 pra liga).
export const TEAM_COUNT_RULES: Record<TournamentFormat, TeamCountRule> = {
  GROUP_STAGE: { min: 4, max: 24, allowed: [4, 8, 12, 16, 20, 24] },
  KNOCKOUT: { min: 2, max: 64, allowed: [2, 4, 8, 16, 32, 64] },
  GROUP_STAGE_KNOCKOUT: { min: 4, max: 64, allowed: [4, 8, 16, 32, 64] },
};

export function isValidMaxTeams(
  format: TournamentFormat,
  maxTeams: number,
): boolean {
  const rule = TEAM_COUNT_RULES[format];
  if (rule.allowed) {
    return rule.allowed.includes(maxTeams);
  }
  return maxTeams >= rule.min && maxTeams <= rule.max;
}
