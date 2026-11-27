import type { PlayerListItem, TeamWithRatings } from '@/features/admin';

export type TransferOriginType = 'MARKET' | 'NEGOTIATION';

// Movimento de um jogador entre dois times na mesma temporada. Uma troca de
// mercado gera 2 entradas com o mesmo transferId (uma por jogador movido);
// uma negociação direta aceita pode gerar só 1 (compra/venda sem troca de
// volta) — nunca assumir que vem em par.
// outgoing*/incoming* (em TransferQuote) guardam o time de cada jogador
// ANTES da troca, não depois.
export type Transfer = {
  transferId: string;
  originType: TransferOriginType;
  player: Pick<PlayerListItem, 'id' | 'name' | 'photoUrl'>;
  date: string;
  requestedBy: { id: string; name: string };
  fromTeam: Pick<TeamWithRatings, 'id' | 'name' | 'crestUrl'>;
  toTeam: Pick<TeamWithRatings, 'id' | 'name' | 'crestUrl'>;
  // Soma líquida dos lançamentos ligados a essa transferência. Em trocas de
  // mercado é o preço pago; em negociações é a soma líquida dos dois lados
  // (+ taxa, quando houver) — não recalculado a partir do overall, pra não
  // divergir se a fórmula de preço mudar depois.
  cost: number;
};

// Prévia de custo de uma troca (GET /transfers/quote), com as mesmas
// validações do POST /transfers — não grava nada.
export type TransferQuote = {
  cost: number;
  balance: number;
  sufficientBalance: boolean;
  outgoingOverallSum: number;
  incomingOverallSum: number;
  couponBalance: number;
  useCoupon: boolean;
};

export type TransferQuoteQuery = {
  outgoingPlayerIds: string[];
  incomingPlayerIds: string[];
  useCoupon: boolean;
};
