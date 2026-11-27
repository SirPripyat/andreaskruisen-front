import { useClub } from '@/features/season/clubs';
import { useNegotiations } from '@/features/season/negotiations';
import { cn, formatNumber } from '@/lib';
import { useTransfers } from '../hooks';

type MarketStatsProps = {
  myTeamId: string | undefined;
};

export const MarketStats = ({ myTeamId }: MarketStatsProps) => {
  const { data: team } = useClub(myTeamId);
  const { data: received } = useNegotiations({ direction: 'received' });
  const { data: sent } = useNegotiations({ direction: 'sent' });
  const { data: transfers } = useTransfers();

  const pendingReceived =
    received?.filter((negotiation) => negotiation.status === 'PENDING')
      .length ?? 0;
  const pendingSent =
    sent?.filter((negotiation) => negotiation.status === 'PENDING').length ?? 0;
  const tradeCount = transfers?.length ?? 0;
  const tradeVolume =
    transfers?.reduce((sum, transfer) => sum + transfer.cost, 0) ?? 0;

  return (
    <div className={'grid grid-cols-2 gap-3 sm:grid-cols-4'}>
      <StatCard
        label={'Saldo do seu time'}
        value={team?.coins != null ? formatNumber(team.coins) : '—'}
        sub={'coins disponíveis'}
        valueClassName={'text-value'}
        barClassName={'bg-value'}
      />
      <StatCard
        label={'Pendentes p/ você'}
        value={formatNumber(pendingReceived)}
        sub={'esperando sua resposta'}
        valueClassName={'text-warning'}
        barClassName={'bg-warning'}
      />
      <StatCard
        label={'Enviadas em aberto'}
        value={formatNumber(pendingSent)}
        sub={'esperando o outro time'}
        valueClassName={'text-info'}
        barClassName={'bg-info'}
      />
      <StatCard
        label={'Trocas na janela'}
        value={formatNumber(tradeCount)}
        sub={`${formatNumber(tradeVolume)} coins movimentados`}
        barClassName={'bg-border'}
      />
    </div>
  );
};

const StatCard = ({
  label,
  value,
  sub,
  valueClassName,
  barClassName,
}: {
  label: string;
  value: string;
  sub: string;
  valueClassName?: string;
  barClassName: string;
}) => (
  <div
    className={
      'relative flex flex-col gap-2 overflow-hidden rounded-2xl border bg-card p-4'
    }
  >
    <span
      className={cn(
        'absolute inset-x-3.5 top-0 h-[3px] rounded-b',
        barClassName,
      )}
    />
    <span
      className={
        'font-mono text-[10.5px] text-muted-foreground uppercase tracking-wide'
      }
    >
      {label}
    </span>
    <span
      className={cn(
        'truncate font-display font-extrabold text-3xl leading-none tabular-nums',
        valueClassName,
      )}
    >
      {value}
    </span>
    <span className={'truncate text-muted-foreground text-xs'}>{sub}</span>
  </div>
);
