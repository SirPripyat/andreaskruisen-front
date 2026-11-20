import type { TeamWithRatings } from '@/features/admin';

export type CoinTransactionType =
  | 'WIN'
  | 'DRAW'
  | 'LOSS'
  | 'PRIZE_PHASE'
  | 'RANKING'
  | 'CHAMPION'
  | 'RUNNER_UP'
  | 'TRANSFER'
  | 'TRANSFER_FEE'
  | 'INITIAL'
  | 'ADJUSTMENT';

// match só vem preenchido em WIN/DRAW/LOSS e no CHAMPION/RUNNER_UP decidido
// numa final de mata-mata — já resolvido pro lado adversário. phase só vem
// em PRIZE_PHASE/RANKING e no CHAMPION/RUNNER_UP decidido por tabela de
// liga. transferId só vem em TRANSFER/TRANSFER_FEE.
export type SquadCoinTransaction = {
  id: string;
  type: CoinTransactionType;
  amount: number;
  createdAt: string;
  match: {
    id: string;
    opponentTeam: Pick<TeamWithRatings, 'id' | 'name' | 'crestUrl'>;
  } | null;
  phase: { id: string; name: string } | null;
  transferId: string | null;
};
