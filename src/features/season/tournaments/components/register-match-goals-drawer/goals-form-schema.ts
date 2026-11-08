import { z } from 'zod';
import type { MatchDetail, PhaseType } from '../../api';

export const GoalRowSchema = z.object({
  scorerId: z.string().min(1, 'Selecione o artilheiro'),
  assistId: z.string(),
});

export const PenaltiesSchema = z
  .object({
    homeScore: z
      .string()
      .min(1, 'Informe o placar')
      .regex(/^\d+$/, 'Informe um número válido'),
    awayScore: z
      .string()
      .min(1, 'Informe o placar')
      .regex(/^\d+$/, 'Informe um número válido'),
  })
  .refine((penalties) => penalties.homeScore !== penalties.awayScore, {
    message: 'Pênaltis não podem terminar empatados',
    path: ['awayScore'],
  });

const BaseFormSchema = z.object({
  homeGoals: z.array(GoalRowSchema),
  awayGoals: z.array(GoalRowSchema),
  penalties: PenaltiesSchema.optional(),
});

export type FormValues = z.infer<typeof BaseFormSchema>;
export type GoalRow = FormValues['homeGoals'][number];
export type GoalsFieldName = 'homeGoals' | 'awayGoals';

// Pênaltis só existem (e só são aceitos pela API) quando a partida é
// eliminatória e termina empatada — por isso a exigência do campo depende da
// fase, e o schema precisa ser construído por partida em vez de ser estático.
export const createFormSchema = (phaseType: PhaseType) => {
  return BaseFormSchema.superRefine((values, ctx) => {
    const isTiedKnockout =
      phaseType === 'KNOCKOUT' &&
      values.homeGoals.length === values.awayGoals.length;

    if (isTiedKnockout && !values.penalties) {
      ctx.addIssue({
        code: 'custom',
        path: ['penalties'],
        message: 'Empate na eliminatória: informe o resultado dos pênaltis',
      });
    }
  });
};

export const toFormValues = (match: MatchDetail | undefined): FormValues => {
  if (!match) {
    return { homeGoals: [], awayGoals: [], penalties: undefined };
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

  return {
    homeGoals,
    awayGoals,
    penalties: match.penalties
      ? {
          homeScore: String(match.penalties.homeScore),
          awayScore: String(match.penalties.awayScore),
        }
      : undefined,
  };
};
