import { z } from 'zod';

export const editNationalitySchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome'),
  flagUrl: z.string().trim().min(1, 'Informe a URL da bandeira'),
});

export type EditNationalityFormValues = z.infer<typeof editNationalitySchema>;
