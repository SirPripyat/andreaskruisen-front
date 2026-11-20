import { z } from 'zod';
import { NEGOTIATION_CLAUSE_TYPES } from './negotiation';

// Mesma validação por tipo do ProposeNegotiationSchema do backend
// (matchesCount só em LEI_DO_EX; amount só em DIREITO_DE_RECOMPRA/
// BONUS_POR_TITULO) — aqui como refine em vez de discriminated union
// porque o builder precisa trocar o tipo de uma linha já existente.
export const negotiationClauseFormSchema = z
  .object({
    type: z.enum(NEGOTIATION_CLAUSE_TYPES),
    playerId: z.string().min(1, 'Selecione o jogador'),
    matchesCount: z.number().int().positive().optional(),
    amount: z.number().int().positive().optional(),
    terms: z.string().optional(),
  })
  .refine(
    (clause) =>
      clause.type !== 'LEI_DO_EX' || typeof clause.matchesCount === 'number',
    { message: 'Informe o número de partidas', path: ['matchesCount'] },
  )
  .refine(
    (clause) =>
      (clause.type !== 'DIREITO_DE_RECOMPRA' &&
        clause.type !== 'BONUS_POR_TITULO') ||
      typeof clause.amount === 'number',
    { message: 'Informe o valor em moedas', path: ['amount'] },
  );

export type NegotiationClauseFormValues = z.infer<
  typeof negotiationClauseFormSchema
>;

export const createNegotiationSchema = z
  .object({
    targetTeamId: z.string().min(1, 'Selecione o time de destino'),
    outgoingPlayerId: z.string().optional(),
    incomingPlayerId: z.string().optional(),
    coinAmount: z.number().int().optional(),
    clauses: z.array(negotiationClauseFormSchema),
  })
  .refine(
    (data) => Boolean(data.outgoingPlayerId) || Boolean(data.incomingPlayerId),
    {
      message: 'A negociação precisa envolver ao menos um jogador',
      path: ['incomingPlayerId'],
    },
  )
  .refine(
    (data) =>
      !data.outgoingPlayerId ||
      !data.incomingPlayerId ||
      data.outgoingPlayerId !== data.incomingPlayerId,
    {
      message: 'Os jogadores precisam ser diferentes',
      path: ['incomingPlayerId'],
    },
  )
  .refine(
    (data) =>
      data.clauses.every((clause) =>
        [data.outgoingPlayerId, data.incomingPlayerId].includes(
          clause.playerId,
        ),
      ),
    {
      message:
        'Cada cláusula precisa se referir a um dos jogadores da negociação',
      path: ['clauses'],
    },
  );

export type CreateNegotiationFormValues = z.infer<
  typeof createNegotiationSchema
>;
