import type {
  ListPlayersQuery,
  PlayerListItem,
} from '@/features/admin/players';
import { api, type PaginatedResult } from '@/lib';

export const listSeasonPlayers = async (query: ListPlayersQuery) => {
  const { data } = await api.get<PaginatedResult<PlayerListItem>>(
    '/players/season',
    { params: query },
  );
  return data;
};
