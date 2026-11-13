import type { Nationality } from '@/features/admin/nationalities';
import type { Team } from '@/features/admin/teams';
import type { SortOrder } from '@/lib';

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
  team: Team;
  nationality: Nationality;
  positions: PlayerPosition[];
  latestRating: PlayerRating | null;
  stats: PlayerStats;
  isFavorite: boolean;
};

export type ImportPlayersResult = {
  processed: number;
  ratingsInserted: number;
};

export type PlayerSortField = 'name' | 'overallRating';

export const POSITION_CODES = [
  'GOL',
  'ZAG',
  'LD',
  'LE',
  'VOL',
  'MC',
  'MD',
  'ME',
  'MEI',
  'PD',
  'PE',
  'ATA',
] as const;

export type PositionCode = (typeof POSITION_CODES)[number];

export const PREFERRED_FOOT_VALUES = ['LEFT', 'RIGHT'] as const;

export type PreferredFootFilter = (typeof PREFERRED_FOOT_VALUES)[number];

export const SKILL_RATING_FIELDS = [
  'skillMoves',
  'weakFootAbility',
  'pac',
  'sho',
  'pas',
  'dri',
  'def',
  'phy',
  'acceleration',
  'agility',
  'jumping',
  'stamina',
  'strength',
  'aggression',
  'balance',
  'ballControl',
  'composure',
  'crossing',
  'curve',
  'defensiveAwareness',
  'dribbling',
  'finishing',
  'freeKickAccuracy',
  'headingAccuracy',
  'interceptions',
  'longPassing',
  'longShots',
  'penalties',
  'positioning',
  'reactions',
  'shortPassing',
  'shotPower',
  'slidingTackle',
  'sprintSpeed',
  'standingTackle',
  'vision',
  'volleys',
  'gkDiving',
  'gkHandling',
  'gkKicking',
  'gkPositioning',
  'gkReflexes',
] as const;

export type SkillRatingField = (typeof SKILL_RATING_FIELDS)[number];

type SkillRangeParams = {
  [K in SkillRatingField as `${K}Min`]?: number;
} & {
  [K in SkillRatingField as `${K}Max`]?: number;
};

export type PlayersAdvancedFilters = {
  nationalityIds?: string[];
  leagueId?: string;
  clubId?: string;
  positions?: PositionCode[];
  preferredFoot?: PreferredFootFilter;
  ageMin?: number;
  ageMax?: number;
  overallMin?: number;
  overallMax?: number;
} & SkillRangeParams;

export type ListPlayersQuery = {
  name?: string;
  page: number;
  pageSize: number;
  sortBy: PlayerSortField;
  sortOrder: SortOrder;
} & PlayersAdvancedFilters;
