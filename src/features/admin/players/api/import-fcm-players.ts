import { api } from '@/lib';
import type { ImportPlayersResult } from '../types';

export type ImportFcmPlayersPayload = {
  file: File;
  capturedAt?: string;
};

export const importFcmPlayers = ({
  file,
  capturedAt,
}: ImportFcmPlayersPayload) => {
  const formData = new FormData();
  formData.append('file', file);
  if (capturedAt) formData.append('capturedAt', capturedAt);

  return api
    .post<ImportPlayersResult>('/import/fcm-players', formData)
    .then((res) => res.data);
};
