import { Link } from 'react-router';
import { Progress, Skeleton } from '@/components/ui';
import { cn, getOverallRatingClassName } from '@/lib';
import { useSimilarPlayers } from '../hooks';

type SimilarPlayersPanelProps = {
  playerId: string;
};

export const SimilarPlayersPanel = ({ playerId }: SimilarPlayersPanelProps) => {
  const { data, isPending } = useSimilarPlayers(playerId, 10);

  if (isPending) {
    return (
      <div className={'flex flex-col gap-4'}>
        <h2
          className={'font-display font-bold text-lg uppercase tracking-tight'}
        >
          Jogadores parecidos
        </h2>
        <div className={'flex flex-col gap-2'}>
          <Skeleton className={'h-16 w-full'} />
          <Skeleton className={'h-16 w-full'} />
          <Skeleton className={'h-16 w-full'} />
        </div>
      </div>
    );
  }

  if (!data || data.results.length === 0) return null;

  return (
    <div className={'flex flex-col gap-4'}>
      <div
        className={
          'flex flex-wrap items-center justify-between gap-2 border-b pb-3'
        }
      >
        <h2
          className={'font-display font-bold text-lg uppercase tracking-tight'}
        >
          Jogadores parecidos
        </h2>
      </div>

      <div className={'flex flex-col gap-2'}>
        {data.results.map((player) => (
          <Link
            key={player.id}
            to={`/players/${player.id}`}
            className={
              'flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-accent/50'
            }
          >
            <img
              src={player.photoUrl}
              alt={player.name}
              className={'size-12 shrink-0 rounded-full object-cover'}
              onError={(event) => {
                event.currentTarget.style.visibility = 'hidden';
              }}
            />

            <div className={'flex min-w-0 flex-1 flex-col gap-1'}>
              <div className={'flex items-center gap-2'}>
                <span className={'truncate font-semibold'}>{player.name}</span>
                <img
                  src={player.team.crestUrl}
                  alt={''}
                  className={'size-3.5 shrink-0 object-contain'}
                />
                <span className={'truncate text-muted-foreground text-xs'}>
                  {player.team.name}
                </span>
              </div>

              <Progress value={player.similarity} max={100} />
            </div>

            <div className={'flex shrink-0 flex-col items-center gap-1 pl-1'}>
              {player.latestRating && (
                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-md font-display font-bold text-sm',
                    getOverallRatingClassName(
                      player.latestRating.overallRating,
                    ),
                  )}
                >
                  {player.latestRating.overallRating}
                </span>
              )}
              <span className={'text-[10px] text-muted-foreground'}>
                {Math.round(player.similarity)}%
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
