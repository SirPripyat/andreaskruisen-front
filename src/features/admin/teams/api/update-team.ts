import { api } from '@/lib';
import type { TeamWithRatings } from './team';

export type UpdateTeamPayload = {
  crestUrl?: string;
};

export const updateTeam = async (
  teamId: string,
  payload: UpdateTeamPayload,
) => {
  const { data } = await api.patch<TeamWithRatings>(
    `/teams/${teamId}`,
    payload,
  );
  return data;
};
