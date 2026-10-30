import { z } from 'zod';
import type { MatchDetail } from '../../api';

export const GoalRowSchema = z.object({
  scorerId: z.string().min(1, 'Selecione o artilheiro'),
  assistId: z.string(),
});

export const FormSchema = z.object({
  homeGoals: z.array(GoalRowSchema),
  awayGoals: z.array(GoalRowSchema),
});

export type FormValues = z.infer<typeof FormSchema>;
export type GoalRow = FormValues['homeGoals'][number];
export type GoalsFieldName = 'homeGoals' | 'awayGoals';

export function toFormValues(match: MatchDetail | undefined): FormValues {
  if (!match) {
    return { homeGoals: [], awayGoals: [] };
  }

  const homePlayerIds = new Set(match.homeTeam.players.map((p) => p.id));
  const homeGoals: FormValues['homeGoals'] = [];
  const awayGoals: FormValues['awayGoals'] = [];

  for (const goal of match.goals) {
    const row = { scorerId: goal.scorer.id, assistId: goal.assist?.id ?? '' };
    if (homePlayerIds.has(goal.scorer.id)) {
      homeGoals.push(row);
    } else {
      awayGoals.push(row);
    }
  }

  return { homeGoals, awayGoals };
}
