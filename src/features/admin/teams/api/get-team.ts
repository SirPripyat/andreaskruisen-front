import { api } from '@/lib';
import type { TeamDetails } from '../types';

export const getTeam = (id: string) =>
  api.get<TeamDetails>(`/teams/${id}`).then((res) => res.data);
