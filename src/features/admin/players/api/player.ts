export type PlayerPosition = {
  position: string;
  isPrimary: boolean;
};

export type PlayerRating = {
  capturedAt: string;
  overallRating: number;
  skillMoves: number;
  weakFootAbility: number;
  pac: number | null;
  sho: number | null;
  pas: number | null;
  dri: number | null;
  def: number | null;
  phy: number | null;
  acceleration: number;
  agility: number;
  jumping: number;
  stamina: number;
  strength: number;
  aggression: number;
  balance: number;
  ballControl: number;
  composure: number;
  crossing: number;
  curve: number;
  defensiveAwareness: number;
  dribbling: number;
  finishing: number;
  freeKickAccuracy: number;
  headingAccuracy: number;
  interceptions: number;
  longPassing: number;
  longShots: number;
  penalties: number;
  positioning: number;
  reactions: number;
  shortPassing: number;
  shotPower: number;
  slidingTackle: number;
  sprintSpeed: number;
  standingTackle: number;
  vision: number;
  volleys: number;
  gkDiving: number;
  gkHandling: number;
  gkKicking: number;
  gkPositioning: number;
  gkReflexes: number;
};

export type PlayerStats = {
  goalsScored: number;
  goalsAssisted: number;
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
  latestRating: PlayerRating | null;
  stats: PlayerStats;
};

export type ImportPlayersResult = {
  processed: number;
  ratingsInserted: number;
};
