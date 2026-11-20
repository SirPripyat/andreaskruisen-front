import { ChevronRightIcon, TrophyIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Card, Skeleton } from '@/components/ui';
import {
  type MyTournament,
  TOURNAMENT_FORMAT_LABELS,
} from '@/features/season/tournaments';
import { cn } from '@/lib';

type DashboardTournamentCardProps = {
  tournaments: MyTournament[];
  teamId: string | undefined;
  isPending: boolean;
};

const RESULT_CLASS: Record<'W' | 'D' | 'L', string> = {
  W: 'bg-success',
  D: 'bg-warning',
  L: 'bg-critical',
};

const pickTournament = (tournaments: MyTournament[]) =>
  tournaments.find((tournament) => tournament.nextMatch) ?? tournaments[0];

export const DashboardTournamentCard = ({
  tournaments,
  teamId,
  isPending,
}: DashboardTournamentCardProps) => {
  if (isPending) {
    return (
      <Card className={'gap-4 p-4'}>
        <Skeleton className={'h-6 w-32'} />
        <Skeleton className={'h-10 w-full'} />
        <Skeleton className={'h-16 w-full'} />
      </Card>
    );
  }

  const tournament = pickTournament(tournaments);

  if (!tournament) {
    return (
      <Card className={'gap-3 p-4'}>
        <div className={'flex items-center gap-2 font-semibold text-sm'}>
          <TrophyIcon className={'size-4 text-accent'} />
          Torneio
        </div>
        <p className={'text-muted-foreground text-sm'}>
          Seu time ainda não está em nenhum torneio desta temporada.
        </p>
      </Card>
    );
  }

  const { myStanding, nextMatch } = tournament;

  const isHome = nextMatch?.homeTeam.id === teamId;
  const opponent = nextMatch
    ? isHome
      ? nextMatch.awayTeam
      : nextMatch.homeTeam
    : null;

  return (
    <Card className={'gap-3 p-4'}>
      <div className={'flex items-start justify-between gap-2'}>
        <div className={'flex items-center gap-2 font-semibold text-sm'}>
          <TrophyIcon className={'size-4 text-accent'} />
          {tournament.name}
        </div>
        <span
          className={
            'shrink-0 rounded-full border px-2.5 py-0.5 text-muted-foreground text-xs font-medium'
          }
        >
          {TOURNAMENT_FORMAT_LABELS[tournament.format]}
        </span>
      </div>

      <div>
        <p className={'font-display text-xl font-extrabold leading-none'}>
          {myStanding ? `${myStanding.position}º lugar` : '—'}
        </p>
        {myStanding && (
          <p className={'font-mono text-muted-foreground text-xs tabular-nums'}>
            {`${myStanding.points} pts · SG ${myStanding.goalDifference > 0 ? '+' : ''}${myStanding.goalDifference}`}
          </p>
        )}
      </div>

      {myStanding && myStanding.last5.length > 0 && (
        <div className={'flex gap-1'}>
          {myStanding.last5.map((result, index) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: last5 is a fixed, fully-replaced list with no stable id
              key={index}
              className={cn(
                'flex size-5 items-center justify-center rounded-md font-semibold text-[10px] text-white',
                RESULT_CLASS[result],
              )}
            >
              {result}
            </span>
          ))}
        </div>
      )}

      {nextMatch && opponent && (
        <div
          className={
            'flex items-center justify-between gap-2 border-t pt-3 text-xs'
          }
        >
          <span className={'text-muted-foreground'}>Próximo jogo</span>
          <span className={'font-semibold'}>
            {`${isHome ? 'em casa' : 'fora'} x ${opponent.name}`}
          </span>
        </div>
      )}

      <Link
        to={`/tournaments/${tournament.id}`}
        className={
          'flex items-center justify-between gap-2 border-t pt-3 font-semibold text-accent text-xs hover:underline'
        }
      >
        Ver classificação
        <ChevronRightIcon className={'size-3.5'} />
      </Link>
    </Card>
  );
};
