import { z } from 'zod';
import { isValidGroupStageSetup, isValidMaxTeams } from '../api/format-rules';
import {
  type GroupStageConfig,
  TOURNAMENT_FORMATS,
  type TournamentFormat,
} from './tournament';

// Campos numéricos chegam como string (mesmo padrão de maxTeams abaixo,
// digitados em <Input type="text">) e são convertidos pra number só no
// payload — ver submitTournament em use-create-tournament-drawer.ts.
export const groupStageConfigSchema = z
  .object({
    groupSize: z
      .string()
      .min(1, 'Informe o tamanho do grupo')
      .regex(/^\d+$/, 'Informe um número inteiro'),
    qualifiersPerGroup: z
      .string()
      .min(1, 'Informe quantos avançam por grupo')
      .regex(/^\d+$/, 'Informe um número inteiro'),
    doubleRound: z.boolean(),
    keepOwnedTeamsInSameGroup: z.boolean(),
  })
  .refine(
    (config) => Number(config.qualifiersPerGroup) <= Number(config.groupSize),
    {
      message: 'Classificados não pode ser maior que o tamanho do grupo',
      path: ['qualifiersPerGroup'],
    },
  );

export const createTournamentSchema = z
  .object({
    name: z.string().min(1, 'Informe o nome do torneio'),
    format: z.enum(TOURNAMENT_FORMATS),
    maxTeams: z
      .string()
      .min(1, 'Informe a quantidade máxima de times')
      .regex(/^\d+$/, 'Informe um número inteiro'),
    // Obrigatório só pra format = GROUP_STAGE_KNOCKOUT (ver refines abaixo).
    groupStageConfig: groupStageConfigSchema.optional(),
  })
  .refine(
    (data) =>
      data.format === 'GROUP_STAGE_KNOCKOUT' ||
      isValidMaxTeams(data.format, Number(data.maxTeams)),
    {
      message: 'Quantidade inválida para esse formato de torneio',
      path: ['maxTeams'],
    },
  )
  .refine(
    (data) =>
      data.format !== 'GROUP_STAGE_KNOCKOUT' ||
      data.groupStageConfig !== undefined,
    {
      message: 'Configure a fase de grupos para esse formato',
      path: ['groupStageConfig'],
    },
  )
  .refine(
    (data) =>
      data.format === 'GROUP_STAGE_KNOCKOUT' ||
      data.groupStageConfig === undefined,
    {
      message: 'Configuração de grupos só se aplica a esse formato',
      path: ['groupStageConfig'],
    },
  )
  .refine(
    (data) =>
      data.format !== 'GROUP_STAGE_KNOCKOUT' ||
      (data.groupStageConfig !== undefined &&
        isValidGroupStageSetup(Number(data.maxTeams), {
          groupSize: Number(data.groupStageConfig.groupSize),
          qualifiersPerGroup: Number(data.groupStageConfig.qualifiersPerGroup),
        })),
    {
      message:
        'A quantidade de times precisa ser múltipla do tamanho do grupo e o total de classificados precisa ser pelo menos 2',
      path: ['maxTeams'],
    },
  );

export type CreateTournamentFormValues = z.infer<typeof createTournamentSchema>;

export type CreateTournamentPayload = {
  name: string;
  format: TournamentFormat;
  maxTeams: number;
  teamIds: string[];
  groupStageConfig?: GroupStageConfig;
};
