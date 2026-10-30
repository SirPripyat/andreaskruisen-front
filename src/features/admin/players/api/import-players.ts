import { api } from '@/lib';
import type { ImportPlayersResult } from './player';

export type ImportPlayersPayload = {
  file: File;
  capturedAt?: string;
};

export async function importPlayers({
  file,
  capturedAt,
}: ImportPlayersPayload) {
  const formData = new FormData();
  formData.append('file', file);
  if (capturedAt) {
    formData.append('capturedAt', capturedAt);
  }

  const { data } = await api.post<ImportPlayersResult>(
    '/players/import',
    formData,
  );
  return data;
}
