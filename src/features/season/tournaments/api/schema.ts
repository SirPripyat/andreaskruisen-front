import { z } from 'zod';
import { isValidMaxTeams } from './format-rules';
import { TOURNAMENT_FORMATS, type TournamentFormat } from './tournament';

export const createTournamentSchema = z
  .object({
    name: z.string().min(1, 'Informe o nome do torneio'),
    format: z.enum(TOURNAMENT_FORMATS),
    maxTeams: z
      .string()
      .min(1, 'Informe a quantidade máxima de times')
      .regex(/^\d+$/, 'Informe um número inteiro'),
  })
  .refine((data) => isValidMaxTeams(data.format, Number(data.maxTeams)), {
    message: 'Quantidade inválida para esse formato de torneio',
    path: ['maxTeams'],
  });

export type CreateTournamentFormValues = z.infer<typeof createTournamentSchema>;

export type CreateTournamentPayload = {
  name: string;
  format: TournamentFormat;
  maxTeams: number;
  teamIds: string[];
};
