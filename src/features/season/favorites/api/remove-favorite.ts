import { api } from '@/lib';

export const removeFavorite = (playerId: string) =>
  api.delete(`/favorites/${playerId}`);
