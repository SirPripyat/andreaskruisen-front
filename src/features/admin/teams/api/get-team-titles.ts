import { api } from '@/lib';
import type { TeamTitle } from '../types';

export const getTeamTitles = (id: string) =>
  api.get<TeamTitle[]>(`/teams/${id}/titles`).then((res) => res.data);
