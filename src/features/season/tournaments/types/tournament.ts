export const TOURNAMENT_FORMATS = [
  'LEAGUE',
  'KNOCKOUT',
  'GROUP_STAGE_KNOCKOUT',
] as const;

export type TournamentFormat = (typeof TOURNAMENT_FORMATS)[number];

export const TOURNAMENT_FORMAT_LABELS: Record<TournamentFormat, string> = {
  LEAGUE: 'Liga',
  KNOCKOUT: 'Mata-mata',
  GROUP_STAGE_KNOCKOUT: 'Fase de grupos + mata-mata',
};

// Obrigatório só pra format = GROUP_STAGE_KNOCKOUT (ver isValidGroupStageSetup
// em api/format-rules.ts). Espelha GroupStageConfigSchema no backend.
export type GroupStageConfig = {
  // Quantos times por grupo.
  groupSize: number;
  // Quantos times de cada grupo avançam pro mata-mata.
  qualifiersPerGroup: number;
  // Ida e volta dentro do grupo em vez de turno único.
  doubleRound: boolean;
  // true = o sorteio concentra os times de participantes nos mesmos grupos;
  // false = distribui um por grupo, misturando com CPU.
  keepOwnedTeamsInSameGroup: boolean;
};

export type PhaseType = 'GROUP' | 'KNOCKOUT';

export type PhaseSummary = {
  id: string;
  type: PhaseType;
  order: number;
  name: string;
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

export type TournamentChampion = TeamSummary & { owner: TeamOwner | null };

export type Tournament = {
  id: string;
  seasonId: string;
  name: string;
  format: TournamentFormat;
  maxTeams: number;
  createdAt: string;
  // null = em andamento; setado via POST /tournaments/:id/finish.
  finishedAt: string | null;
  // Só a fase de maior order (a vigente) acompanha — fases seguintes só
  // existem depois que a atual termina. null após o torneio ser encerrado.
  currentPhase: PhaseSummary | null;
  // null enquanto o torneio não foi encerrado.
  champion: TournamentChampion | null;
  // Quantos times de cada grupo avançam pro mata-mata — null pra formatos
  // que não são GROUP_STAGE_KNOCKOUT.
  qualifiersPerGroup: number | null;
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
  // null = bye (ver GroupStageConfig) — o time da casa avança sem jogar.
  awayTeam: ConfrontoTeam | null;
};

// Situação da fase vigente: classificação por grupo (GROUP) ou os confrontos
// (KNOCKOUT) — nunca os dois ao mesmo tempo.
export type TournamentSituation = {
  phase: PhaseSummary;
} & (
  | { groups: Record<string, StandingWithOwner[]>; matches?: undefined }
  | { matches: Confronto[]; groups?: undefined }
);

// Classificação de um único grupo (GET /tournaments/:id/groups/:groupLabel)
// — usado onde só o grupo de uma partida específica importa, sem buscar os
// demais grupos do torneio.
export type TournamentGroupSituation = {
  phase: PhaseSummary;
  groupLabel: string;
  standings: StandingWithOwner[];
};

// Só existe quando a partida é KNOCKOUT e termina empatada no tempo normal.
export type MatchPenalties = {
  homeScore: number;
  awayScore: number;
  winnerTeamId: string;
};

export type MatchListItem = {
  id: string;
  groupLabel: string | null;
  // Rodada do turno único dentro do grupo (1 a 3). Só em fases GROUP.
  round: number | null;
  // null = partida ainda não jogada.
  homeScore: number | null;
  awayScore: number | null;
  penalties: MatchPenalties | null;
  homeTeam: ConfrontoTeam;
  // null = bye (ver GroupStageConfig) — sem adversário, sem placar.
  awayTeam: ConfrontoTeam | null;
  // true = a fase seguinte já foi gerada a partir desta (ver POST
  // /tournaments/:id/phases/:phaseId/advance) ou o torneio já foi
  // encerrado (POST /tournaments/:id/finish) — resultado não pode mais
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
  phaseType: PhaseType;
  playedAt: string | null;
  penalties: MatchPenalties | null;
  homeTeam: MatchTeamWithPlayers;
  // null = bye (ver GroupStageConfig).
  awayTeam: MatchTeamWithPlayers | null;
  goals: MatchGoal[];
  // true = a fase seguinte já foi gerada a partir desta (ver POST
  // /tournaments/:id/phases/:phaseId/advance) ou o torneio já foi
  // encerrado (POST /tournaments/:id/finish) — resultado não pode mais
  // ser editado.
  locked: boolean;
};

export type GoalLeader = {
  player: MatchPlayerOption;
  team: TeamSummary;
  count: number;
  // Só vêm preenchidos no Hall da Fama (GET /tournaments/hall-of-fame) —
  // o ranking por torneio (GET /tournaments/:id/top-scorers|top-assists)
  // não manda esses campos.
  matchesPlayed?: number;
  average?: number;
  titles?: number;
};

export type HallOfFameLeader = GoalLeader & {
  matchesPlayed: number;
  average: number;
  titles: number;
};

// GET /tournaments/hall-of-fame?format=... — ranking agregado por tipo de
// campeonato (não de um torneio específico), escopado pela temporada.
export type HallOfFame = {
  topScorers: HallOfFameLeader[];
  topAssists: HallOfFameLeader[];
};

export type NextMatchSummary = {
  id: string;
  phaseName: string;
  groupLabel: string | null;
  round: number | null;
  homeTeam: TeamSummary;
  // null = bye (ver GroupStageConfig).
  awayTeam: TeamSummary | null;
};

export type TournamentDashboard = Tournament & {
  totalMatches: number;
  playedMatches: number;
  topScorer: GoalLeader | null;
  nextMatch: NextMatchSummary | null;
};

export type MyStanding = Pick<
  GroupStanding,
  'position' | 'points' | 'goalDifference' | 'last5'
>;

// GET /tournaments/mine — torneios da temporada que o time do usuário
// disputa, com a classificação e o próximo jogo dele na fase vigente.
export type MyTournament = Tournament & {
  myStanding: MyStanding | null;
  nextMatch: NextMatchSummary | null;
};
