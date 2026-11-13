import { api } from '@/lib';
import type { FavoritePlayer } from '../types';

export const listFavorites = () =>
  api.get<FavoritePlayer[]>('/favorites').then((res) => res.data);
