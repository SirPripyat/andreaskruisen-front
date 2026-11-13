import type { PlayerPosition } from '@/features/admin/players';

export type SimilarPlayer = {
  id: string;
  eaId: number;
  name: string;
  photoUrl: string;
  birthdate: string;
  preferredFoot: string;
  team: { id: string; name: string; crestUrl: string };
  nationality: { id: string; name: string; flagUrl: string };
  positions: PlayerPosition[];
  latestRating: { overallRating: number; capturedAt: string } | null;
  similarity: number;
};

export type SimilarPlayersResult = {
  reference: Omit<SimilarPlayer, 'similarity'>;
  results: SimilarPlayer[];
};
