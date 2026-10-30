import { z } from 'zod';

export const createSeasonSchema = z.object({
  name: z.string().min(1, 'Informe o nome da temporada'),
});

export type CreateSeasonFormValues = z.infer<typeof createSeasonSchema>;

export type CreateSeasonSquad = {
  userId: string;
  teamId: string;
};

export type CreateSeasonPayload = CreateSeasonFormValues & {
  squads?: CreateSeasonSquad[];
};
