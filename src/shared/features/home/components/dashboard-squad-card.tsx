import { ChevronRightIcon, UserRoundIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Card, Progress, Skeleton } from '@/components/ui';
import type { RosterBySector, RosterPlayer } from '@/features/season/squads';
import { getOverallRatingIndicatorClassName } from '@/lib';

type DashboardSquadCardProps = {
  teamId: string | undefined;
  roster: RosterBySector | undefined;
  isPending: boolean;
};

const SECTOR_LABELS: Record<keyof RosterBySector, string> = {
  goalkeepers: 'Gol',
  defenders: 'Def',
  midfielders: 'Mei',
  attackers: 'Ata',
};

const SECTOR_ORDER: (keyof RosterBySector)[] = [
  'goalkeepers',
  'defenders',
  'midfielders',
  'attackers',
];

const average = (players: RosterPlayer[]) =>
  players.length === 0
    ? null
    : players.reduce((sum, player) => sum + player.overallRating, 0) /
      players.length;

export const DashboardSquadCard = ({
  teamId,
  roster,
  isPending,
}: DashboardSquadCardProps) => {
  if (isPending) {
    return (
      <Card className={'gap-4 p-4'}>
        <Skeleton className={'h-6 w-24'} />
        <Skeleton className={'h-16 w-full'} />
        <Skeleton className={'h-20 w-full'} />
      </Card>
    );
  }

  if (!roster) return null;

  const allPlayers = SECTOR_ORDER.flatMap((sector) => roster[sector]);
  const overallAverage = average(allPlayers);

  const topPlayer = allPlayers.reduce<RosterPlayer | null>(
    (best, player) =>
      !best || player.overallRating > best.overallRating ? player : best,
    null,
  );

  return (
    <Card className={'gap-4 p-4'}>
      <div className={'flex items-start justify-between gap-2'}>
        <div className={'flex items-center gap-2 font-semibold text-sm'}>
          <UserRoundIcon className={'size-4 text-accent'} />
          Elenco
        </div>
        <span
          className={
            'shrink-0 rounded-full border px-2.5 py-0.5 text-muted-foreground text-xs font-medium'
          }
        >{`${allPlayers.length} jogadores`}</span>
      </div>

      <div>
        <p
          className={
            'font-display text-2xl font-extrabold leading-none tabular-nums'
          }
        >
          {overallAverage ? Math.round(overallAverage) : '—'}
        </p>
        <p className={'text-muted-foreground text-xs'}>overall médio</p>
      </div>

      <div className={'flex flex-col gap-2.5'}>
        {SECTOR_ORDER.map((sector) => {
          const sectorAverage = average(roster[sector]);

          if (sectorAverage === null) return null;

          return (
            <div key={sector} className={'flex flex-col gap-1'}>
              <div className={'flex items-center justify-between text-xs'}>
                <span
                  className={
                    'font-semibold text-muted-foreground uppercase tracking-wide'
                  }
                >
                  {SECTOR_LABELS[sector]}
                </span>
                <span className={'font-display font-bold'}>
                  {Math.round(sectorAverage)}
                </span>
              </div>
              <Progress
                value={sectorAverage}
                max={99}
                indicatorClassName={getOverallRatingIndicatorClassName(
                  sectorAverage,
                )}
              />
            </div>
          );
        })}
      </div>

      {topPlayer && (
        <div className={'flex items-center justify-between gap-2 text-xs'}>
          <span className={'text-muted-foreground'}>Destaque</span>
          <span className={'font-semibold'}>
            {`${topPlayer.name} · ${Math.round(topPlayer.overallRating)} ${topPlayer.position}`}
          </span>
        </div>
      )}

      <Link
        to={`/clubs/${teamId}?tab=roster`}
        className={
          'flex items-center justify-between gap-2 border-t pt-3 font-semibold text-accent text-xs hover:underline'
        }
      >
        Gerenciar elenco
        <ChevronRightIcon className={'size-3.5'} />
      </Link>
    </Card>
  );
};
