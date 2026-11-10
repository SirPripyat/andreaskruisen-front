import { api } from '@/lib';

export type ImportTeamImagesPayload = {
  file: File;
  capturedAt?: string;
};

export type ImportTeamImagesResult = {
  processed: number;
  imagesUpdated: number;
};

export const importTeamImages = async ({
  file,
  capturedAt,
}: ImportTeamImagesPayload) => {
  const formData = new FormData();
  formData.append('file', file);
  if (capturedAt) {
    formData.append('capturedAt', capturedAt);
  }

  const { data } = await api.post<ImportTeamImagesResult>(
    '/import/team-crests',
    formData,
  );
  return data;
};
