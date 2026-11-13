import { api } from '@/lib';

export const addFavorite = (playerId: string) =>
  api.post(`/favorites/${playerId}`);
