import { TicketPercentIcon } from 'lucide-react';
import { Badge, Skeleton } from '@/components/ui';
import type { NegotiationWindowStatus } from '@/features/admin/negotiation-window';
import { cn, formatDateTime } from '@/lib';

type MarketScoreboardProps = {
  data?: NegotiationWindowStatus;
  isPending?: boolean;
};

export const MarketScoreboard = ({
  data,
  isPending,
}: MarketScoreboardProps) => {
  if (isPending) return <Skeleton className={'h-[76px] w-full rounded-2xl'} />;

  const open = data?.open;

  return (
    <div
      className={
        'flex flex-wrap items-stretch overflow-hidden rounded-2xl border bg-card shadow-xs'
      }
    >
      <div
        className={cn(
          'flex min-w-45 items-center gap-2.5 px-5 py-3.5',
          open ? 'bg-success-surface' : 'bg-critical-surface',
        )}
      >
        <span
          className={cn(
            'size-2.5 shrink-0 rounded-full',
            open ? 'bg-success' : 'bg-critical',
          )}
        />
        <span
          className={cn(
            'font-display font-extrabold text-base uppercase leading-none',
            open ? 'text-success' : 'text-critical',
          )}
        >
          {open ? 'Janela aberta' : 'Janela fechada'}
        </span>
      </div>

      <div
        className={
          'flex flex-1 flex-wrap items-center gap-7 border-t px-5 py-3.5 sm:border-t-0 sm:border-l'
        }
      >
        {open ? (
          <>
            <MetaItem
              label={'Aberta desde'}
              value={formatDateTime(open.openedAt)}
              mono
            />
            <MetaItem label={'Aberta por'} value={open.openedBy.name} />
            <div className={'flex flex-col gap-1'}>
              <span
                className={
                  'font-mono text-[10px] text-muted-foreground uppercase tracking-wide'
                }
              >
                {'Taxa de negociação'}
              </span>
              <Badge
                variant={'outline'}
                className={
                  'w-fit gap-1.5 border-transparent bg-value/10 text-value'
                }
              >
                <TicketPercentIcon className={'size-3'} />
                {open.feeEnabled ? 'Ativada' : 'Desativada'}
              </Badge>
            </div>
          </>
        ) : (
          <span className={'text-muted-foreground text-sm'}>
            {
              'A janela está fechada — negociações e trocas de mercado ficam bloqueadas até o admin abrir novamente.'
            }
          </span>
        )}
      </div>
    </div>
  );
};

const MetaItem = ({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div className={'flex min-w-[120px] flex-col gap-1'}>
    <span
      className={
        'font-mono text-[10px] text-muted-foreground uppercase tracking-wide'
      }
    >
      {label}
    </span>
    <span className={cn('text-sm', mono && 'font-mono tabular-nums')}>
      {value}
    </span>
  </div>
);
