import { Link } from 'react-router';
import { Badge, Separator } from '@/components/ui';
import {
  type PlayerPosition,
  PlayerPositionCell,
} from '@/features/admin/players';
import { FavoriteButton } from '@/features/season/favorites';
import { PlayerStatSquare } from '@/features/season/players';
import {
  cn,
  getOverallRatingBorderClassName,
  getOverallRatingClassName,
  PREFERRED_FOOT_LABELS,
} from '@/lib';
import { NegotiateButton } from '@/shared/features/players';

type PlayerInfoPanelProps = {
  playerId: string;
  photoUrl: string;
  name: string;
  team: { id: string; name: string; crestUrl: string };
  nationality: { name: string; flagUrl: string };
  positions: PlayerPosition[];
  preferredFoot: string;
  age: number;
  overall: number | null;
  isFavorite: boolean;
  goalsScored: number;
  goalsAssisted: number;
  statTierClassName: string;
};

export const PlayerInfoPanel = ({
  playerId,
  photoUrl,
  name,
  team,
  nationality,
  positions,
  preferredFoot,
  age,
  overall,
  isFavorite,
  goalsScored,
  goalsAssisted,
  statTierClassName,
}: PlayerInfoPanelProps) => {
  const borderClassName =
    overall !== null
      ? getOverallRatingBorderClassName(Math.round(overall))
      : 'border-t-accent';

  return (
    <div
      className={cn(
        'flex flex-col gap-4 overflow-hidden rounded-xl border-t-4 bg-card p-5 ring-1 ring-foreground/10',
        borderClassName,
      )}
    >
      <div className={'flex items-center gap-3'}>
        <img
          src={photoUrl}
          alt={name}
          className={'size-16 shrink-0 rounded-full object-cover sm:size-20'}
          onError={(event) => {
            event.currentTarget.style.visibility = 'hidden';
          }}
        />

        <div className={'flex min-w-0 flex-1 flex-col gap-1.5'}>
          <h1
            className={
              'font-display font-extrabold text-xl uppercase tracking-tight text-balance sm:text-2xl'
            }
          >
            {name}
          </h1>

          <PlayerPositionCell positions={positions} />
        </div>

        {overall !== null && (
          <div
            className={cn(
              'flex size-14 shrink-0 flex-col items-center justify-center gap-0 rounded-md font-bold text-lg',
              getOverallRatingClassName(Math.round(overall)),
            )}
          >
            {Math.round(overall)}
          </div>
        )}
      </div>

      <div className={'flex flex-wrap items-center gap-2'}>
        <Badge
          variant={'outline'}
          className={'gap-1.5'}
          render={<Link to={`/clubs/${team.id}`} />}
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

      <div className="flex flex-col gap-2">
        <NegotiateButton playerId={playerId} teamId={team.id} fullWidth />

        <FavoriteButton playerId={playerId} isFavorite={isFavorite} fullWidth />
      </div>

      <Separator />

      <div className={'grid grid-cols-3 gap-2'}>
        <PlayerStatSquare
          label={'Gols'}
          value={String(goalsScored)}
          sub={'Na temporada'}
          tierClassName={statTierClassName}
        />
        <PlayerStatSquare
          label={'Assist.'}
          value={String(goalsAssisted)}
          sub={'Na temporada'}
          tierClassName={statTierClassName}
        />
        <PlayerStatSquare
          label={'G + A'}
          value={String(goalsScored + goalsAssisted)}
          sub={'Direta'}
          tierClassName={statTierClassName}
        />
      </div>
    </div>
  );
};
