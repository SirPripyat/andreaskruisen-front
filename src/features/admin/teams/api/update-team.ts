import { api } from '@/lib';
import type { TeamWithRatings } from './team';

export type UpdateTeamPayload = {
  crestUrl?: string;
};

export async function updateTeam(teamId: string, payload: UpdateTeamPayload) {
  const { data } = await api.patch<TeamWithRatings>(
    `/teams/${teamId}`,
    payload,
  );
  return data;
}
