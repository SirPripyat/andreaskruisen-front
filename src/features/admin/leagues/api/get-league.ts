import { api } from '@/lib';
import type { LeagueWithCountry } from '../types';

export const getLeague = (id: string) =>
  api.get<LeagueWithCountry>(`/leagues/${id}`).then((res) => res.data);
