import type {
  PlayerPosition,
  PlayerRating,
  PlayerStats,
} from '@/features/admin/players';

export type PlayerDetail = {
  id: string;
  eaId: number;
  name: string;
  photoUrl: string;
  birthdate: string;
  preferredFoot: string;
  team: { id: string; name: string; crestUrl: string };
  nationality: { id: string; name: string; flagUrl: string };
  positions: PlayerPosition[];
  latestRating: PlayerRating | null;
  stats: PlayerStats;
};
