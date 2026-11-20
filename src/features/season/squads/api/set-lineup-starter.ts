import type { PositionCode } from '@/features/admin/players';
import { api } from '@/lib';
import type { LineupOverview } from '../types';

export type SetLineupStarterPayload = {
  teamId: string;
  playerId: string;
  isStarter: boolean;
  position?: PositionCode;
};

export const setLineupStarter = ({
  teamId,
  playerId,
  isStarter,
  position,
}: SetLineupStarterPayload) =>
  api
    .patch<LineupOverview>(`/squads/${teamId}/lineup/${playerId}`, {
      isStarter,
      position,
    })
    .then((res) => res.data);
