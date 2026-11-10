import { api } from '@/lib';

export type ImportLineupsPayload = {
  file: File;
  capturedAt?: string;
};

export type ImportLineupsResult = {
  processed: number;
  lineupsInserted: number;
};

export const importLineups = async ({
  file,
  capturedAt,
}: ImportLineupsPayload) => {
  const formData = new FormData();
  formData.append('file', file);
  if (capturedAt) {
    formData.append('capturedAt', capturedAt);
  }

  const { data } = await api.post<ImportLineupsResult>(
    '/import/team-lineups',
    formData,
  );
  return data;
};
