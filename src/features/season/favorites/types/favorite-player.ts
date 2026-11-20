import type { PlayerPosition } from '@/features/admin/players';

export type FavoritePlayer = {
  id: string;
  eaId: number;
  name: string;
  photoUrl: string;
  team: { id: string; name: string; crestUrl: string };
  nationality: { id: string; name: string; flagUrl: string };
  positions: PlayerPosition[];
  latestOverallRating: number;
  favoritedAt: string;
};
