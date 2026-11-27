import { TicketPercentIcon } from 'lucide-react';
import { Badge, Skeleton } from '@/components/ui';
import type { NegotiationWindowStatus } from '@/features/admin/negotiation-window';
import { cn, formatShortDate } from '@/lib';

type MarketScoreboardProps = {
  data?: NegotiationWindowStatus;
  isPending?: boolean;
};

export const MarketScoreboard = ({
  data,
  isPending,
}: MarketScoreboardProps) => {
  if (isPending) return <Skeleton className={'h-15 w-full rounded-2xl'} />;

  const open = data?.open;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border-l-4 border bg-card p-3.5',
        open ? 'border-l-success' : 'border-l-critical',
      )}
    >
      <span
        className={cn(
          'size-2 shrink-0 rounded-full',
          open ? 'bg-success' : 'bg-critical',
        )}
      />

      <div className={'min-w-0 flex-1'}>
        <p
          className={cn(
            'font-display font-extrabold text-sm uppercase leading-none',
            open ? 'text-success' : 'text-critical',
          )}
        >
          {open ? 'Janela aberta' : 'Janela fechada'}
        </p>
        <p className={'mt-1 truncate text-muted-foreground text-xs'}>
          {open
            ? `Desde ${formatShortDate(open.openedAt)} · por ${open.openedBy.name}`
            : 'Trocas bloqueadas até o admin abrir'}
        </p>
      </div>

      {open?.feeEnabled && (
        <Badge
          variant={'outline'}
          className={'shrink-0 gap-1 border-transparent bg-value/10 text-value'}
        >
          <TicketPercentIcon className={'size-3'} />
          {'Taxa'}
        </Badge>
      )}
    </div>
  );
};
