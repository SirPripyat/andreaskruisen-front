import { api, serializeQueryParams } from '@/lib';
import type { HallOfFame, TournamentFormat } from '../types';

export const getHallOfFame = (format: TournamentFormat) =>
  api
    .get<HallOfFame>('/tournaments/hall-of-fame', {
      params: serializeQueryParams({ format }),
    })
    .then((res) => res.data);
