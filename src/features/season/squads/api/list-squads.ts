import { api } from '@/lib';
import type { SeasonSquad } from '../types';

export const listSquads = () =>
  api.get<SeasonSquad[]>('/squads').then((res) => res.data);
