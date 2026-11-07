import { z } from 'zod';
import type { SortOrder } from '@/lib';

export const editTeamCrestSchema = z.object({
  crestUrl: z.string().min(1, 'Informe a URL do escudo').url('URL inválida'),
});

export type EditTeamCrestFormValues = z.infer<typeof editTeamCrestSchema>;

export type TeamSortField =
  | 'name'
  | 'averageOverallRating'
  | 'averageDefenseRating'
  | 'averageMidfieldRating'
  | 'averageAttackRating';

export type ListTeamsQuery = {
  name?: string;
  withoutFormation?: boolean;
  leagueId?: string;
  page: number;
  pageSize: number;
  sortBy: TeamSortField;
  sortOrder: SortOrder;
};
