import { api } from '@/lib';
import type { ClubTitle } from '../types';

export const getClubTitles = (id: string) =>
  api.get<ClubTitle[]>(`/clubs/${id}/titles`).then((res) => res.data);
