import { api } from '@/lib';
import type { TeamWithRatings } from '../types';

export type UpdateTeamPayload = {
  crestUrl?: string;
};

export const updateTeam = (teamId: string, payload: UpdateTeamPayload) =>
  api
    .patch<TeamWithRatings>(`/teams/${teamId}`, payload)
    .then((res) => res.data);
