import { api } from '@/lib';
import type { LeagueWithCountry } from '../types';

export type UpdateLeaguePayload = {
  name?: string;
  logoUrl?: string | null;
  countryId?: string | null;
};

export const updateLeague = (leagueId: string, payload: UpdateLeaguePayload) =>
  api
    .patch<LeagueWithCountry>(`/leagues/${leagueId}`, payload)
    .then((res) => res.data);
