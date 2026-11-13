import { api } from '@/lib';

export type ImportTeamImagesPayload = {
  file: File;
  capturedAt?: string;
};

export type ImportTeamImagesResult = {
  processed: number;
  imagesUpdated: number;
};

export const importTeamImages = ({
  file,
  capturedAt,
}: ImportTeamImagesPayload) => {
  const formData = new FormData();
  formData.append('file', file);
  if (capturedAt) formData.append('capturedAt', capturedAt);

  return api
    .post<ImportTeamImagesResult>('/import/team-crests', formData)
    .then((res) => res.data);
};
