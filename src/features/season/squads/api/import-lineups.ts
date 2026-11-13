import { api } from '@/lib';

export type ImportLineupsPayload = {
  file: File;
  capturedAt?: string;
};

export type ImportLineupsResult = {
  processed: number;
  lineupsInserted: number;
};

export const importLineups = ({ file, capturedAt }: ImportLineupsPayload) => {
  const formData = new FormData();
  formData.append('file', file);
  if (capturedAt) formData.append('capturedAt', capturedAt);

  return api
    .post<ImportLineupsResult>('/import/team-lineups', formData)
    .then((res) => res.data);
};
