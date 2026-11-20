import { ArrowRightIcon } from 'lucide-react';
import { formatNumber, formatTime } from '@/lib';
import type { Transfer } from '../types';
import { PlayerCell } from './player-cell';
import { TeamCell } from './team-cell';
import { TransferOriginBadge } from './transfer-origin-badge';

export const TransferTicket = ({ transfer }: { transfer: Transfer }) => {
  return (
    <div
      className={
        'flex flex-col rounded-xl border bg-card shadow-xs sm:flex-row'
      }
    >
      <div className={'flex min-w-0 flex-1 flex-col gap-2.5 p-3.5'}>
        <TransferOriginBadge originType={transfer.originType} />

        <PlayerCell player={transfer.player} />

        <div className={'flex min-w-0 items-center gap-2'}>
          <TeamCell team={transfer.fromTeam} />
          <ArrowRightIcon className={'size-3.5 shrink-0 text-border-strong'} />
          <TeamCell team={transfer.toTeam} />
        </div>
      </div>

      <div
        className={
          'relative shrink-0 border-t border-dashed border-border-strong sm:border-t-0 sm:border-l'
        }
      >
        <span
          className={
            'absolute top-0 left-0 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-b bg-card sm:left-1/2'
          }
        />
        <span
          className={
            'absolute top-0 right-0 size-3.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-card border-t sm:top-auto sm:right-auto sm:bottom-0 sm:left-1/2 sm:-translate-x-1/2 sm:translate-y-1/2'
          }
        />
      </div>

      <div
        className={
          'flex shrink-0 flex-row items-center justify-between gap-4 p-3.5 sm:w-33 sm:flex-col sm:items-end sm:justify-center sm:gap-1.5 sm:text-right'
        }
      >
        <div className={'flex flex-col gap-0.5 sm:items-end'}>
          <span
            className={
              'font-display font-extrabold text-2xl text-value leading-none tabular-nums'
            }
          >
            {formatNumber(transfer.cost)}
          </span>
          <span
            className={
              'font-mono text-[9.5px] text-muted-foreground uppercase tracking-wide'
            }
          >
            {'coins'}
          </span>
        </div>

        <div className={'flex flex-col gap-0.5 sm:items-end'}>
          <span className={'font-mono text-xs tabular-nums'}>
            {formatTime(transfer.date)}
          </span>
          <span className={'max-w-27.5 truncate text-muted-foreground text-xs'}>
            {`por ${transfer.requestedBy.name}`}
          </span>
        </div>
      </div>
    </div>
  );
};
