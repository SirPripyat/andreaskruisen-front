import { Link } from 'react-router';
import { Badge } from '@/components/ui';
import {
  type PlayerPosition,
  PlayerPositionCell,
} from '@/features/admin/players';
import { cn, getOverallRatingClassName } from '@/lib';

const PREFERRED_FOOT_LABELS: Record<string, string> = {
  LEFT: 'Canhoto',
  RIGHT: 'Destro',
  BOTH: 'Ambidestro',
};

type PlayerInfoPanelProps = {
  photoUrl: string;
  name: string;
  team: { id: string; name: string; crestUrl: string };
  nationality: { name: string; flagUrl: string };
  positions: PlayerPosition[];
  preferredFoot: string;
  age: number;
  overall: number | null;
};

export const PlayerInfoPanel = ({
  photoUrl,
  name,
  team,
  nationality,
  positions,
  preferredFoot,
  age,
  overall,
}: PlayerInfoPanelProps) => {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border-t-4 border-t-accent bg-card py-0 ring-1 ring-foreground/10',
        'flex flex-wrap gap-4 px-5 py-4 items-center',
      )}
    >
      <img
        src={photoUrl}
        alt={name}
        className={'size-16 shrink-0 rounded-full object-cover sm:size-24'}
        onError={(event) => {
          event.currentTarget.style.visibility = 'hidden';
        }}
      />

      <div className={'flex min-w-0 flex-1 flex-col gap-2'}>
        <h1
          className={
            'font-display font-extrabold text-2xl uppercase tracking-tight text-balance sm:text-4xl'
          }
        >
          {name}
        </h1>

        <div className={'flex flex-wrap items-center gap-2'}>
          <Badge
            variant={'outline'}
            className={'gap-1.5'}
            render={<Link to={`/teams/${team.id}`} />}
          >
            <img
              src={team.crestUrl}
              alt={''}
              className={'size-3.5 object-contain'}
            />
            {team.name}
          </Badge>

          <Badge variant={'outline'} className={'gap-1.5'}>
            <img
              src={nationality.flagUrl}
              alt={''}
              className={'size-3.5 rounded-full object-cover'}
            />
            {nationality.name}
          </Badge>

          <Badge variant={'outline'}>
            {PREFERRED_FOOT_LABELS[preferredFoot] ?? preferredFoot}
          </Badge>

          <Badge variant={'outline'}>{age} anos</Badge>
        </div>

        <PlayerPositionCell positions={positions} />
      </div>

      {overall !== null && (
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
