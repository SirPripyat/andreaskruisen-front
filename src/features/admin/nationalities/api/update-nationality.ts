import { api } from '@/lib';
import type { Nationality } from '../types';

export type UpdateNationalityPayload = {
  name?: string;
  flagUrl?: string;
};

export const updateNationality = (
  nationalityId: string,
  payload: UpdateNationalityPayload,
) =>
  api
    .patch<Nationality>(`/nationalities/${nationalityId}`, payload)
    .then((res) => res.data);
