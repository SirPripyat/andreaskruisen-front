import type { CreateSeasonFormValues } from './schema';

export type Season = {
  id: string;
  name: string;
  startedAt: string;
  isActive: boolean;
};

export type CreateSeasonSquad = {
  userId: string;
  teamId: string;
};

export type CreateSeasonPayload = CreateSeasonFormValues & {
  squads?: CreateSeasonSquad[];
};
