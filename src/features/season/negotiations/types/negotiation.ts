export const NEGOTIATION_STATUSES = [
  'PENDING',
  'ACCEPTED',
  'REJECTED',
] as const;
export type NegotiationStatus = (typeof NEGOTIATION_STATUSES)[number];

export const NEGOTIATION_CLAUSE_TYPES = [
  'LEI_DO_EX',
  'DIREITO_DE_RECOMPRA',
  'PREFERENCIA_DE_COMPRA',
  'BONUS_POR_TITULO',
] as const;
export type NegotiationClauseType = (typeof NEGOTIATION_CLAUSE_TYPES)[number];

export type NegotiationPlayerSummary = {
  id: string;
  name: string;
  photoUrl: string;
};

export type NegotiationSquadSummary = {
  squadId: string;
  user: { id: string; name: string };
  team: { id: string; name: string; crestUrl: string };
};

export type NegotiationClause = {
  id: string;
  type: NegotiationClauseType;
  amount: number | null;
  matchesCount: number | null;
  terms: string | null;
  player: NegotiationPlayerSummary;
};

// Espelha NegotiationResponseDTO do backend (DirectNegotiation + squads e
// jogadores resolvidos) — coinAmount positivo = proposingSquad paga
// targetSquad; negativo = o contrário (ver schema.prisma).
export type Negotiation = {
  id: string;
  seasonId: string;
  status: NegotiationStatus;
  coinAmount: number | null;
  createdAt: string;
  resolvedAt: string | null;
  proposingSquad: NegotiationSquadSummary;
  targetSquad: NegotiationSquadSummary;
  outgoingPlayer: NegotiationPlayerSummary | null;
  incomingPlayer: NegotiationPlayerSummary | null;
  clauses: NegotiationClause[];
};

export type NegotiationDirection = 'sent' | 'received';

export type ListNegotiationsQuery = {
  direction: NegotiationDirection;
};

export type NegotiationClausePayload = {
  type: NegotiationClauseType;
  playerId: string;
  amount?: number;
  matchesCount?: number;
  terms?: string;
};

export type ProposeNegotiationPayload = {
  targetTeamId: string;
  outgoingPlayerId?: string;
  incomingPlayerId?: string;
  coinAmount?: number;
  clauses?: NegotiationClausePayload[];
};
