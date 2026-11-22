import { api } from '@/lib';
import type { ClubDetails } from '../types';

export const getClub = (id: string) =>
  api.get<ClubDetails>(`/clubs/${id}`).then((res) => res.data);
