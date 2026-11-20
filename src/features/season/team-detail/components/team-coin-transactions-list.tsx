import { cn } from 'cn';
import {
  ArrowLeftRightIcon,
  AwardIcon,
  CheckCircle2Icon,
  CoinsIcon,
  EqualIcon,
  MedalIcon,
  ReceiptIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  TrendingUpIcon,
  TrophyIcon,
  XCircleIcon,
} from 'lucide-react';
import { Skeleton } from '@/components/ui';
import type {
  CoinTransactionType,
  SquadCoinTransaction,
} from '@/features/season/squads';
import { formatDateTime, formatNumber } from '@/lib';

const TYPE_LABEL: Record<CoinTransactionType, string> = {
  WIN: 'Vitória',
  DRAW: 'Empate',
  LOSS: 'Derrota',
  PRIZE_PHASE: 'Premiação de fase',
  RANKING: 'Classificação',
  CHAMPION: 'Campeão',
  RUNNER_UP: 'Vice-campeão',
  TRANSFER: 'Transferência',
  TRANSFER_FEE: 'Taxa de transferência',
  INITIAL: 'Saldo inicial',
  ADJUSTMENT: 'Ajuste',
};

const TYPE_ICON: Record<CoinTransactionType, typeof CoinsIcon> = {
  WIN: CheckCircle2Icon,
  DRAW: EqualIcon,
  LOSS: XCircleIcon,
  PRIZE_PHASE: AwardIcon,
  RANKING: TrendingUpIcon,
  CHAMPION: TrophyIcon,
  RUNNER_UP: MedalIcon,
  TRANSFER: ArrowLeftRightIcon,
  TRANSFER_FEE: ReceiptIcon,
  INITIAL: SparklesIcon,
  ADJUSTMENT: SlidersHorizontalIcon,
};

const getContext = (transaction: SquadCoinTransaction) => {
  if (transaction.match) return `vs ${transaction.match.opponentTeam.name}`;
  if (transaction.phase) return transaction.phase.name;
  if (transaction.transferId) return 'Movimentação de elenco';
  return null;
};

export const TeamCoinTransactionsList = ({
  transactions,
  isPending,
}: {
  transactions: SquadCoinTransaction[];
  isPending: boolean;
}) => {
  if (isPending) {
    return (
      <div className={'flex flex-col gap-2'}>
        <Skeleton className={'h-14 w-full'} />
        <Skeleton className={'h-14 w-full'} />
        <Skeleton className={'h-14 w-full'} />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <p className={'p-4 text-center text-muted-foreground text-sm'}>
        Nenhuma movimentação de coins registrada nesta temporada.
      </p>
    );
  }

  return (
    <div className={'flex flex-col'}>
      {transactions.map((transaction) => {
        const Icon = TYPE_ICON[transaction.type];
        const context = getContext(transaction);

        return (
          <div
            key={transaction.id}
            className={'flex items-center gap-3 border-b py-3.5 last:border-0'}
          >
            <span
              className={
                'flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground'
              }
            >
              <Icon className={'size-4'} />
            </span>
            <div className={'flex min-w-0 flex-col'}>
              <span className={'text-sm'}>{TYPE_LABEL[transaction.type]}</span>
              {context && (
                <span className={'truncate text-muted-foreground text-xs'}>
                  {context}
                </span>
              )}
            </div>

            <span
              className={cn(
                'ml-auto flex shrink-0 items-center gap-1.5 font-mono font-semibold text-sm tabular-nums',
                transaction.amount > 0 ? 'text-success' : 'text-critical',
              )}
            >
              <CoinsIcon className={'size-3.5'} />
              {transaction.amount > 0 ? '+' : '−'}
              {formatNumber(Math.abs(transaction.amount))}
            </span>

            <span
              className={'shrink-0 font-mono text-muted-foreground text-xs'}
            >
              {formatDateTime(transaction.createdAt)}
            </span>
          </div>
        );
      })}
    </div>
  );
};
