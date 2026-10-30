import { api, type PaginatedResult } from '@/lib';
import type { PlayerListItem } from './player';
import type { ListPlayersQuery } from './schema';

export async function listPlayers(query: ListPlayersQuery) {
  const { data } = await api.get<PaginatedResult<PlayerListItem>>('/players', {
    params: query,
  });
  return data;
}
