export const TOURNAMENT_FORMATS = [
  'GROUP_STAGE',
  'KNOCKOUT',
  'GROUP_STAGE_KNOCKOUT',
] as const;

export type TournamentFormat = (typeof TOURNAMENT_FORMATS)[number];

export const TOURNAMENT_FORMAT_LABELS: Record<TournamentFormat, string> = {
  GROUP_STAGE: 'Fase de grupos',
  KNOCKOUT: 'Mata-mata',
  GROUP_STAGE_KNOCKOUT: 'Fase de grupos + mata-mata',
};

export type Tournament = {
  id: string;
  seasonId: string;
  name: string;
  format: TournamentFormat;
  maxTeams: number;
  createdAt: string;
};

export type PhaseType = 'GROUP' | 'KNOCKOUT';

export type PhaseSummary = {
  id: string;
  type: PhaseType;
  order: number;
  name: string;
};

// Resumo do torneio: só a fase de maior order (a vigente) acompanha — fases
// seguintes só existem depois que a atual termina.
export type TournamentSummary = Tournament & {
  currentPhase: PhaseSummary | null;
};

export type TeamSummary = {
  id: string;
  name: string;
  crestUrl: string;
};

export type TeamOwner = {
  id: string;
  name: string;
};

export type GroupStanding = {
  position: number;
  teamId: string;
  teamName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  winPercentage: number;
  teamCrestUrl: string;
  last5: ('W' | 'D' | 'L')[];
};

export type StandingWithOwner = GroupStanding & { owner: TeamOwner | null };

export type ConfrontoTeam = TeamSummary & { owner: TeamOwner | null };

export type Confronto = {
  id: string;
  homeTeam: ConfrontoTeam;
  awayTeam: ConfrontoTeam;
};

// Situação da fase vigente: classificação por grupo (GROUP) ou os confrontos
// (KNOCKOUT) — nunca os dois ao mesmo tempo.
export type TournamentSituation = {
  phase: PhaseSummary;
} & (
  | { groups: Record<string, StandingWithOwner[]>; matches?: undefined }
  | { matches: Confronto[]; groups?: undefined }
);

export type MatchListItem = {
  id: string;
  groupLabel: string | null;
  // Rodada do turno único dentro do grupo (1 a 3). Só em fases GROUP.
  round: number | null;
  // null = partida ainda não jogada.
  homeScore: number | null;
  awayScore: number | null;
  homeTeam: ConfrontoTeam;
  awayTeam: ConfrontoTeam;
  // true = a fase seguinte já foi gerada a partir desta (ver POST
  // /tournaments/:id/phases/:phaseId/advance) — resultado não pode mais
  // ser editado.
  locked: boolean;
};

export type MatchPlayerOption = {
  id: string;
  name: string;
  photoUrl: string;
  position: string;
};

export type MatchTeamWithPlayers = TeamSummary & {
  players: MatchPlayerOption[];
};

export type MatchGoal = {
  id: string;
  scorer: MatchPlayerOption;
  assist: MatchPlayerOption | null;
};

export type MatchDetail = {
  id: string;
  groupLabel: string | null;
  round: number | null;
  playedAt: string | null;
  homeTeam: MatchTeamWithPlayers;
  awayTeam: MatchTeamWithPlayers;
  goals: MatchGoal[];
  // true = a fase seguinte já foi gerada a partir desta (ver POST
  // /tournaments/:id/phases/:phaseId/advance) — resultado não pode mais
  // ser editado.
  locked: boolean;
};

export type GoalLeader = {
  player: MatchPlayerOption;
  team: TeamSummary;
  count: number;
};

export type NextMatchSummary = {
  id: string;
  phaseName: string;
  groupLabel: string | null;
  round: number | null;
  homeTeam: TeamSummary;
  awayTeam: TeamSummary;
};

export type TournamentDashboard = TournamentSummary & {
  totalMatches: number;
  playedMatches: number;
  topScorer: GoalLeader | null;
  nextMatch: NextMatchSummary | null;
};
