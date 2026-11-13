import type {
  ListPlayersQuery,
  PlayerListItem,
} from '@/features/admin/players';
import { api, type PaginatedResult, serializeQueryParams } from '@/lib';

export const listSeasonPlayers = (query: ListPlayersQuery) =>
  api
    .get<PaginatedResult<PlayerListItem>>('/players/season', {
      params: serializeQueryParams(query),
    })
    .then((res) => res.data);
