import { z } from 'zod';

export const createTransferSchema = z
  .object({
    outgoingPlayerIds: z
      .array(z.string())
      .min(1, 'Selecione o jogador de saída')
      .max(2),
    incomingPlayerIds: z
      .array(z.string())
      .min(1, 'Selecione o jogador de destino')
      .max(2),
    useCoupon: z.boolean(),
    // Só o admin pode preencher — backend ignora esse campo pra quem não
    // é admin e usa sempre o próprio usuário autenticado (ver CLAUDE.md do
    // backend).
    requestedByUserId: z.string().optional(),
  })
  .refine(
    (data) =>
      data.outgoingPlayerIds.every(
        (id) => !data.incomingPlayerIds.includes(id),
      ),
    {
      message: 'Selecione jogadores diferentes',
      path: ['incomingPlayerIds'],
    },
  );

export type CreateTransferFormValues = z.infer<typeof createTransferSchema>;

export type CreateTransferPayload = {
  outgoingPlayerIds: string[];
  incomingPlayerIds: string[];
  useCoupon: boolean;
  requestedByUserId?: string;
};
