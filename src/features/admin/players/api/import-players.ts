import { api } from '@/lib';
import type { ImportPlayersResult } from '../types';

export type ImportPlayersPayload = {
  file: File;
  capturedAt?: string;
};

export const importPlayers = ({ file, capturedAt }: ImportPlayersPayload) => {
  const formData = new FormData();
  formData.append('file', file);
  if (capturedAt) formData.append('capturedAt', capturedAt);

  return api
    .post<ImportPlayersResult>('/import/players', formData)
    .then((res) => res.data);
};
