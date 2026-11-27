import { useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui';
import type { TeamWithRatings } from '@/features/admin/teams';
import { formatShortDate, getErrorMessage } from '@/lib';
import { useTransfers } from '../hooks';
import type { Transfer } from '../types';
import { TeamCombobox } from './team-combobox';
import { TransferTicket } from './transfer-ticket';

const dayKey = (date: string) => new Date(date).toDateString();

const dayHeading = (date: string) => {
  const today = new Date();
  const target = new Date(date);
  const diffDays = Math.round(
    (new Date(today.toDateString()).getTime() -
      new Date(target.toDateString()).getTime()) /
      86_400_000,
  );

  if (diffDays === 0) return `Hoje · ${formatShortDate(target)}`;
  if (diffDays === 1) return `Ontem · ${formatShortDate(target)}`;
  return formatShortDate(target);
};

const groupByDay = (transfers: Transfer[]) => {
  const sorted = [...transfers].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const groups = new Map<string, Transfer[]>();
  for (const transfer of sorted) {
    const key = dayKey(transfer.date);
    const group = groups.get(key) ?? [];
    group.push(transfer);
    groups.set(key, group);
  }

  return Array.from(groups.values());
};

export const MarketTimeline = () => {
  const { data: transfers, isPending, isError, error } = useTransfers();
  const [teamFilter, setTeamFilter] = useState<TeamWithRatings | null>(null);

  const filtered = useMemo(() => {
    if (!transfers) return [];
    if (!teamFilter) return transfers;
    return transfers.filter(
      (transfer) =>
        transfer.fromTeam.id === teamFilter.id ||
        transfer.toTeam.id === teamFilter.id,
    );
  }, [transfers, teamFilter]);

  const groups = useMemo(() => groupByDay(filtered), [filtered]);

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex flex-wrap items-center gap-3'}>
        <TeamCombobox
          value={teamFilter}
          onValueChange={setTeamFilter}
          placeholder={'Filtrar por time...'}
          className={'w-full sm:w-auto'}
        />
        {!isPending && !isError && (
          <span className={'text-muted-foreground text-xs'}>
            {teamFilter
              ? `${filtered.length} de ${transfers?.length ?? 0} transferências envolvendo ${teamFilter.name}`
              : `${transfers?.length ?? 0} transferências nesta janela`}
          </span>
        )}
      </div>

      {isPending ? (
        <div className={'flex flex-col gap-2'}>
          <Skeleton className={'h-16 w-full'} />
          <Skeleton className={'h-16 w-full'} />
          <Skeleton className={'h-16 w-full'} />
        </div>
      ) : isError ? (
        <p className={'text-destructive text-sm'}>
          {getErrorMessage(
            error,
            'Não foi possível carregar as transferências.',
          )}
        </p>
      ) : groups.length === 0 ? (
        <p className={'p-6 text-center text-muted-foreground text-sm'}>
          {teamFilter
            ? 'Nenhuma transferência encontrada para esse time.'
            : 'Nenhuma transferência registrada ainda.'}
        </p>
      ) : (
        <div className={'flex flex-col gap-6'}>
          {groups.map((group) => (
            <div
              key={dayKey(group[0].date)}
              className={'flex flex-col gap-2.5'}
            >
              <div
                className={
                  'flex items-center gap-2.5 font-mono text-[11px] text-muted-foreground uppercase tracking-wide'
                }
              >
                {dayHeading(group[0].date)}
                <span className={'h-px flex-1 bg-border'} />
              </div>

              <div className={'flex flex-col gap-2'}>
                {group.map((transfer) => (
                  <TransferTicket
                    key={`${transfer.transferId}-${transfer.player.id}`}
                    transfer={transfer}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
