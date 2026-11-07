import type { GoalLeader, TeamOwner, TeamSummary } from '@/features/season';

export type TeamWithRatings = {
  id: string;
  name: string;
  crestUrl: string;
  league: { id: string; name: string };
  averageOverallRating: number | null;
  averageDefenseRating: number | null;
  averageMidfieldRating: number | null;
  averageAttackRating: number | null;
  formation: string | null;
};

export type SeasonCampaign = {
  games: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  pointsPercentage: number;
};

export type RecentMatchResult = {
  matchId: string;
  playedAt: Date;
  opponent: TeamSummary;
  goalsFor: number;
  goalsAgainst: number;
  result: 'V' | 'E' | 'D';
};

export type HeadToHeadRecord = {
  opponent: TeamSummary;
  games: number;
  wins: number;
  draws: number;
  losses: number;
};

export type TeamStats = {
  owner: TeamOwner | null;
  seasonCampaign: SeasonCampaign | null;
  lastMatches: RecentMatchResult[];
  topScorers: GoalLeader[];
  topAssists: GoalLeader[];
  biggestVictim: HeadToHeadRecord | null;
  biggestTormentor: HeadToHeadRecord | null;
};

export type TeamDetails = TeamStats & TeamWithRatings;
