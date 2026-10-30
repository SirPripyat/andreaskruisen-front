import { z } from 'zod';
import type { SortOrder } from '@/lib';

export type PlayerSortField = 'name' | 'overallRating';

export type ListPlayersQuery = {
  name?: string;
  page: number;
  pageSize: number;
  sortBy: PlayerSortField;
  sortOrder: SortOrder;
};

export const importPlayersSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine(
      (files) => files.length > 0,
      'Selecione o arquivo JSON exportado pelo scraper',
    ),
  capturedAt: z.string().optional(),
});

export type ImportPlayersFormValues = z.infer<typeof importPlayersSchema>;
