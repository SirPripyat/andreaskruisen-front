import { z } from 'zod';
import type { Nationality } from '@/features/admin/nationalities';

export const editLeagueSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome'),
  logoUrl: z.url('Informe uma URL válida').or(z.literal('')),
  country: z.custom<Nationality | null>(),
});

export type EditLeagueFormValues = z.infer<typeof editLeagueSchema>;
