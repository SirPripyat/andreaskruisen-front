import { api, type PaginatedResult, serializeQueryParams } from '@/lib';
import type { ListPlayersQuery, PlayerListItem } from '../types';

export const listPlayers = (query: ListPlayersQuery) =>
  api
    .get<PaginatedResult<PlayerListItem>>('/players', {
      params: serializeQueryParams(query),
    })
    .then((res) => res.data);
