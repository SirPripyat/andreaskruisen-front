import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(4, 'O nome deve ter ao menos 4 caracteres'),
  pin: z
    .string()
    .length(4, 'O PIN deve ter 4 dígitos')
    .regex(/^\d{4}$/, 'O PIN deve conter apenas números'),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export type CreateUserPayload = CreateUserFormValues;
