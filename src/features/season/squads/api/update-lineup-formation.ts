import { api } from '@/lib';
import type { LineupOverview } from '../types';
import { type Formation, getFormationRequestValue } from './formation';

export type UpdateLineupFormationPayload = {
  teamId: string;
  formation: Formation;
};

export const updateLineupFormation = ({
  teamId,
  formation,
}: UpdateLineupFormationPayload) =>
  api
    .patch<LineupOverview>(`/squads/${teamId}/lineup/formation`, {
      formation: getFormationRequestValue(formation),
    })
    .then((res) => res.data);
