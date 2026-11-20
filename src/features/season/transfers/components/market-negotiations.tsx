import { useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui';
import {
  type Negotiation,
  NegotiationCard,
  type NegotiationDirection,
  useNegotiations,
} from '@/features/season/negotiations';
import { cn, getErrorMessage } from '@/lib';

const FILTERS = ['all', 'received', 'sent', 'pending'] as const;
type NegotiationFilter = (typeof FILTERS)[number];

const FILTER_LABELS: Record<NegotiationFilter, string> = {
  all: 'Todas',
  received: 'Recebidas',
  sent: 'Enviadas',
  pending: 'Pendentes',
};

type DirectedNegotiation = Negotiation & { direction: NegotiationDirection };

type MarketNegotiationsProps = {
  myTeamId: string | undefined;
};

export const MarketNegotiations = ({ myTeamId }: MarketNegotiationsProps) => {
  const [filter, setFilter] = useState<NegotiationFilter>('all');

  const received = useNegotiations({ direction: 'received' });
  const sent = useNegotiations({ direction: 'sent' });

  const isPending = received.isPending || sent.isPending;
  const isError = received.isError || sent.isError;

  const negotiations = useMemo<DirectedNegotiation[]>(() => {
    const directed: DirectedNegotiation[] = [
      ...(received.data ?? []).map((negotiation) => ({
        ...negotiation,
        direction: 'received' as const,
      })),
      ...(sent.data ?? []).map((negotiation) => ({
        ...negotiation,
        direction: 'sent' as const,
      })),
    ];

    return directed.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [received.data, sent.data]);

  const counts: Record<NegotiationFilter, number> = {
    all: negotiations.length,
    received: negotiations.filter((n) => n.direction === 'received').length,
    sent: negotiations.filter((n) => n.direction === 'sent').length,
    pending: negotiations.filter((n) => n.status === 'PENDING').length,
  };

  const filtered = negotiations.filter((negotiation) => {
    if (filter === 'received') return negotiation.direction === 'received';
    if (filter === 'sent') return negotiation.direction === 'sent';
    if (filter === 'pending') return negotiation.status === 'PENDING';
    return true;
  });

  return (
    <div className={'flex flex-col gap-4'}>
      <div
        role={'toolbar'}
        aria-label={'Filtrar negociações'}
        className={'flex flex-wrap gap-2'}
      >
        {FILTERS.map((candidate) => (
          <button
            key={candidate}
            type={'button'}
            aria-pressed={filter === candidate}
            onClick={() => setFilter(candidate)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-medium text-muted-foreground text-xs',
              filter === candidate
                ? 'border-foreground bg-foreground text-background'
                : 'hover:bg-muted/40',
            )}
          >
            {FILTER_LABELS[candidate]}
            <span
              className={cn(
                'font-mono text-[10.5px] opacity-70',
                filter === candidate && 'opacity-80',
              )}
            >
              {counts[candidate]}
            </span>
          </button>
        ))}
      </div>

      {isPending ? (
        <div className={'grid gap-3 sm:grid-cols-2'}>
          <Skeleton className={'h-40 w-full'} />
          <Skeleton className={'h-40 w-full'} />
        </div>
      ) : isError ? (
        <p className={'text-destructive text-sm'}>
          {getErrorMessage(
            received.error ?? sent.error,
            'Não foi possível carregar as negociações.',
          )}
        </p>
      ) : filtered.length === 0 ? (
        <p className={'p-6 text-center text-muted-foreground text-sm'}>
          {'Nenhuma negociação encontrada para esse filtro.'}
        </p>
      ) : (
        <div className={'grid gap-3 sm:grid-cols-2'}>
          {filtered.map((negotiation) => (
            <NegotiationCard
              key={`${negotiation.direction}-${negotiation.id}`}
              negotiation={negotiation}
              myTeamId={myTeamId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
