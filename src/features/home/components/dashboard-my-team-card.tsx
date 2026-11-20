import {
  ChevronRightIcon,
  CoinsIcon,
  ShieldIcon,
  TicketPercentIcon,
} from 'lucide-react';
import { Link } from 'react-router';
import { Card, Skeleton } from '@/components/ui';
import type { TeamDetails } from '@/features/admin/teams';
import { TeamRecentFormChips } from '@/features/season/team-detail';
import { formatNumber } from '@/lib';

type DashboardMyTeamCardProps = {
  team: TeamDetails | undefined;
  isPending: boolean;
};

export const DashboardMyTeamCard = ({
  team,
  isPending,
}: DashboardMyTeamCardProps) => {
  if (isPending) {
    return (
      <Card className={'col-span-2 gap-4 p-4'}>
        <Skeleton className={'h-9 w-40'} />
        <Skeleton className={'h-16 w-full'} />
        <Skeleton className={'h-10 w-full'} />
      </Card>
    );
  }

  if (!team) return null;

  const campaign = team.seasonCampaign;

  return (
    <Card className={'col-span-2 gap-4 p-4'}>
      <div className={'flex items-start justify-between gap-2'}>
        <div className={'flex items-center gap-2.5'}>
          <span
            className={
              'flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-accent-surface'
            }
          >
            {team.crestUrl ? (
              <img
                src={team.crestUrl}
                alt={''}
                className={'size-full object-contain p-1'}
              />
            ) : (
              <ShieldIcon className={'size-4 text-accent'} />
            )}
          </span>
          <div>
            <p className={'font-display text-base font-bold leading-tight'}>
              {team.name}
            </p>
            <p className={'text-muted-foreground text-xs'}>
              {team.league.name}
              {team.formation ? ` · formação ${team.formation}` : ''}
            </p>
          </div>
        </div>
        <span
          className={
            'shrink-0 rounded-full border px-2.5 py-0.5 text-muted-foreground text-xs font-medium'
          }
        >
          Seu time
        </span>
      </div>

      <div className={'flex flex-wrap items-baseline gap-4'}>
        <div>
          <p
            className={
              'font-display text-2xl font-extrabold leading-none tabular-nums'
            }
          >
            {campaign ? `${campaign.points} pts` : '—'}
          </p>
          <p className={'text-muted-foreground text-xs'}>
            {campaign
              ? `${Math.round(campaign.pointsPercentage)}% de aproveitamento`
              : 'Nenhuma partida disputada'}
          </p>
        </div>
        {campaign && (
          <div
            className={
              'flex gap-3 font-mono text-muted-foreground text-xs tabular-nums'
            }
          >
            <span>{`J${campaign.games}`}</span>
            <span>{`V${campaign.wins}`}</span>
            <span>{`E${campaign.draws}`}</span>
            <span>{`D${campaign.losses}`}</span>
            <span>{`GP${campaign.goalsFor}`}</span>
            <span>{`GC${campaign.goalsAgainst}`}</span>
          </div>
        )}
      </div>

      <div className={'flex flex-wrap items-center justify-between gap-3'}>
        <TeamRecentFormChips matches={team.lastMatches} />

        <div className={'flex gap-4'}>
          {team.coins !== null && (
            <div className={'flex items-center gap-1.5 text-sm'}>
              <CoinsIcon className={'size-3.5 text-value'} />
              <span className={'font-semibold tabular-nums'}>
                {formatNumber(team.coins)}
              </span>
              <span className={'text-muted-foreground'}>coins</span>
            </div>
          )}
          {team.couponBalance !== null && team.couponBalance > 0 && (
            <div className={'flex items-center gap-1.5 text-sm'}>
              <TicketPercentIcon className={'size-3.5 text-muted-foreground'} />
              <span className={'font-semibold tabular-nums'}>
                {team.couponBalance}
              </span>
            </div>
          )}
        </div>
      </div>

      <Link
        to={`/clubs/${team.id}`}
        className={
          'flex items-center justify-between gap-2 border-t pt-3 font-semibold text-accent text-xs hover:underline'
        }
      >
        Ver time completo
        <ChevronRightIcon className={'size-3.5'} />
      </Link>
    </Card>
  );
};
