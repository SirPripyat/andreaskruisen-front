export type PlayerPosition = {
  position: string;
  isPrimary: boolean;
};

export type LatestRating = {
  overallRating: number;
  capturedAt: string;
};

export type PlayerListItem = {
  id: string;
  eaId: number;
  name: string;
  photoUrl: string;
  birthdate: string;
  preferredFoot: string;
  team: { id: string; name: string; crestUrl: string };
  nationality: { id: string; name: string; flagUrl: string };
  positions: PlayerPosition[];
  latestRating: LatestRating | null;
};

export type ImportPlayersResult = {
  processed: number;
  ratingsInserted: number;
};
