import { z } from 'zod';

export const loginSchema = z.object({
  name: z.string().min(1, 'Informe o usuário'),
  pin: z
    .string()
    .length(4, 'O PIN deve ter 4 dígitos')
    .regex(/^\d{4}$/, 'O PIN deve conter apenas números'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(4, 'O nome deve ter ao menos 4 caracteres'),
  pin: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^\d{4}$/.test(value),
      'O PIN deve ter 4 dígitos',
    ),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
