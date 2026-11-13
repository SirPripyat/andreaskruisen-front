import { api } from '@/lib';
import type { LineupOverview } from '../types';

export type SwapLineupStarterPayload = {
  teamId: string;
  starterOutId: string;
  benchInId: string;
};

export const swapLineupStarter = ({
  teamId,
  starterOutId,
  benchInId,
}: SwapLineupStarterPayload) =>
  api
    .patch<LineupOverview>(`/squads/${teamId}/lineup`, {
      starterOutId,
      benchInId,
    })
    .then((res) => res.data);
