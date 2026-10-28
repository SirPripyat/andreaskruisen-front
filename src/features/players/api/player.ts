export type PlayerPosition = {
  position: string;
  isPrimary: boolean;
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
  latestRating: { overallRating: number; capturedAt: string } | null;
};

export type ImportPlayersResult = {
  processed: number;
  ratingsInserted: number;
};
