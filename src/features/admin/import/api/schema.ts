import { z } from 'zod';

export const fileImportSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine(
      (files) => files.length > 0,
      'Selecione o arquivo JSON exportado pelo scraper',
    ),
  capturedAt: z.string().optional(),
});

export type FileImportFormValues = z.infer<typeof fileImportSchema>;
