import { ArrowLeftRightIcon, ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Card, Skeleton } from '@/components/ui';
import type { NegotiationWindowStatus } from '@/features/admin/negotiation-window';
import type { Transfer } from '@/features/season/transfers';
import { formatShortDate } from '@/lib';

type DashboardMarketCardProps = {
  teamId: string | undefined;
  transfers: Transfer[];
  windowStatus: NegotiationWindowStatus | undefined;
  isPending: boolean;
};

export const DashboardMarketCard = ({
  teamId,
  transfers,
  windowStatus,
  isPending,
}: DashboardMarketCardProps) => {
  if (isPending) {
    return (
      <Card className={'col-span-2 gap-4 p-4'}>
        <Skeleton className={'h-6 w-32'} />
        <Skeleton className={'h-14 w-full'} />
      </Card>
    );
  }

  const myTransfers = transfers
    .filter(
      (transfer) =>
        transfer.fromTeam.id === teamId || transfer.toTeam.id === teamId,
    )
    .slice(0, 2);

  return (
    <Card className={'col-span-2 gap-4 p-4'}>
      <div className={'flex items-start justify-between gap-2'}>
        <div className={'flex items-center gap-2 font-semibold text-sm'}>
          <ArrowLeftRightIcon className={'size-4 text-accent'} />
          Mercado
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 font-semibold text-xs ${
            windowStatus?.open
              ? 'bg-success-surface text-success'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {windowStatus?.open ? 'Janela aberta' : 'Janela fechada'}
        </span>
      </div>

      {myTransfers.length === 0 ? (
        <p className={'text-muted-foreground text-sm'}>
          Nenhuma troca de mercado envolvendo seu time ainda.
        </p>
      ) : (
        <div className={'flex flex-col'}>
          {myTransfers.map((transfer, index) => (
            <div
              key={`${transfer.transferId}-${transfer.player.id}`}
              className={`flex items-center justify-between gap-2 py-2 text-sm ${index > 0 ? 'border-t' : ''}`}
            >
              <span className={'min-w-0 truncate'}>
                {`${transfer.player.name} · ${transfer.fromTeam.name} → ${transfer.toTeam.name}`}
              </span>
              <span
                className={'shrink-0 font-mono text-muted-foreground text-xs'}
              >
                {formatShortDate(transfer.date)}
              </span>
            </div>
          ))}
        </div>
      )}

      <Link
        to={'/transfers'}
        className={
          'mt-auto flex items-center justify-between gap-2 border-t pt-3 font-semibold text-accent text-xs hover:underline'
        }
      >
        Ver mercado
        <ChevronRightIcon className={'size-3.5'} />
      </Link>
    </Card>
  );
};
