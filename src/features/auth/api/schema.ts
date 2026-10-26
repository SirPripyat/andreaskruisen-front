import { z } from 'zod';

export const loginSchema = z.object({
  name: z.string().min(1, 'Informe o usuário'),
  pin: z
    .string()
    .length(4, 'O PIN deve ter 4 dígitos')
    .regex(/^\d{4}$/, 'O PIN deve conter apenas números'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
