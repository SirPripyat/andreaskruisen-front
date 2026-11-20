import { z } from 'zod';

export const createTransferSchema = z
  .object({
    outgoingPlayerId: z.string().min(1, 'Selecione o jogador de saída'),
    incomingPlayerId: z.string().min(1, 'Selecione o jogador de destino'),
    useCoupon: z.boolean(),
    // Só o admin pode preencher — backend ignora esse campo pra quem não
    // é admin e usa sempre o próprio usuário autenticado (ver CLAUDE.md do
    // backend).
    requestedByUserId: z.string().optional(),
  })
  .refine((data) => data.outgoingPlayerId !== data.incomingPlayerId, {
    message: 'Selecione dois jogadores diferentes',
    path: ['incomingPlayerId'],
  });

export type CreateTransferFormValues = z.infer<typeof createTransferSchema>;

export type CreateTransferPayload = {
  outgoingPlayerId: string;
  incomingPlayerId: string;
  useCoupon: boolean;
  requestedByUserId?: string;
};
