import { api } from '@/lib';
import type { SeasonSquad } from './squad';

export const listSquads = async () => {
  const { data } = await api.get<SeasonSquad[]>('/squads');
  return data;
};
