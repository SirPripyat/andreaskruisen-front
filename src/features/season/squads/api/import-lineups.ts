import { api } from '@/lib';

export type ImportLineupsPayload = {
  file: File;
  capturedAt?: string;
};

export type ImportLineupsResult = {
  processed: number;
  lineupsInserted: number;
};

export async function importLineups({
  file,
  capturedAt,
}: ImportLineupsPayload) {
  const formData = new FormData();
  formData.append('file', file);
  if (capturedAt) {
    formData.append('capturedAt', capturedAt);
  }

  const { data } = await api.post<ImportLineupsResult>(
    '/teams/import-lineups',
    formData,
  );
  return data;
}
