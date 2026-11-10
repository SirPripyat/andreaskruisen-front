import { UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui';
import { cn, getOverallRatingClassName } from '@/lib';

type TeamInfoPanelProps = {
  crestUrl: string;
  team: string;
  league: string;
  manager: string | null;
  overall: number | null;
};

export const TeamInfoPanel = ({
  crestUrl,
  team,
  league,
  manager,
  overall,
}: TeamInfoPanelProps) => {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border-t-4 border-t-accent bg-card py-0 ring-1 ring-foreground/10',
        'flex flex-wrap gap-4 px-5 py-4 items-center',
      )}
    >
      <img
        src={crestUrl}
        alt={team}
        className={'size-16 shrink-0 object-contain sm:size-24'}
        onError={(event) => {
          event.currentTarget.style.visibility = 'hidden';
        }}
      />
      <div className={'flex min-w-0 flex-1 flex-col gap-1'}>
        <h1
          className={
            'font-display font-extrabold text-2xl uppercase tracking-tight text-balance sm:text-4xl'
          }
        >
          {team}
        </h1>

        <div className={'flex flex-wrap items-center gap-2'}>
          <Badge variant={'outline'}>{league}</Badge>

          {manager && (
            <Badge
              className={
                'gap-1.5 border-transparent bg-success-surface text-success'
              }
            >
              <UserIcon className={'size-3.5'} />
              Treinador: {manager}
            </Badge>
          )}
        </div>
      </div>

      {overall && (
        <div
          className={cn(
            'ml-auto size-16 flex flex-col -gap-1 shrink-0 items-center justify-center rounded-md font-bold text-xl sm:size-18 sm:text-2xl',
            getOverallRatingClassName(Math.round(overall)),
          )}
        >
          {Math.round(overall)}
          <span className={'uppercase text-xs'}>Overall</span>
        </div>
      )}
    </div>
  );
};
