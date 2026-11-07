import { z } from 'zod';

export const createTransferSchema = z
  .object({
    outgoingPlayerId: z.string().min(1, 'Selecione o jogador de saída'),
    incomingPlayerId: z.string().min(1, 'Selecione o jogador de destino'),
  })
  .refine((data) => data.outgoingPlayerId !== data.incomingPlayerId, {
    message: 'Selecione dois jogadores diferentes',
    path: ['incomingPlayerId'],
  });

export type CreateTransferFormValues = z.infer<typeof createTransferSchema>;

export type CreateTransferPayload = {
  outgoingPlayerId: string;
  incomingPlayerId: string;
};
