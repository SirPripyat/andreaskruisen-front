import { Link } from 'react-router';
import { OverallRatingBadge, TeamCell } from '@/components';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import {
  type PlayerListItem,
  PlayerPositionCell,
} from '@/features/admin/players';
import { FavoriteButton } from '@/features/season/favorites';
import { calculateAge, getInitials, PREFERRED_FOOT_LABELS } from '@/lib';
import { ActionCell, NegotiateButton } from '@/shared/features/players';

type PlayerCardProps = {
  player: PlayerListItem;
};

export const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <div className={'rounded-xl border bg-card p-3'}>
      <div className={'flex items-start justify-between gap-2'}>
        <Link
          to={`/players/${player.id}`}
          className={'flex min-w-0 items-center gap-2.5'}
        >
          <Avatar size={'lg'} className={'shrink-0'}>
            <AvatarImage src={player.photoUrl} alt={player.name} />
            <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
          </Avatar>

          <div className={'min-w-0'}>
            <p className={'truncate font-medium text-sm'}>{player.name}</p>

            <div className={'mt-0.5'}>
              <PlayerPositionCell positions={player.positions} />
            </div>

            <div
              className={
                'mt-1 flex items-center gap-1.5 truncate text-muted-foreground text-xs'
              }
            >
              <TeamCell
                crestUrl={player.team.crestUrl}
                name={player.team.name}
                size={'sm'}
              />
              <span>·</span>
              <span className={'truncate'}>{player.nationality.name}</span>
            </div>
          </div>
        </Link>

        <OverallRatingBadge
          rating={player.latestRating?.overallRating ?? null}
        />
      </div>

      <div className={'mt-2 flex items-center justify-between border-t pt-2'}>
        <div
          className={
            'flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground'
          }
        >
          <span>{calculateAge(player.birthdate)} anos</span>
          <span>·</span>
          <span>{PREFERRED_FOOT_LABELS[player.preferredFoot]}</span>
        </div>

        <div className={'flex items-center'}>
          <FavoriteButton playerId={player.id} isFavorite={player.isFavorite} />
          <NegotiateButton
            playerId={player.id}
            teamId={player.team.id}
            compact
          />
          <ActionCell id={player.id} />
        </div>
      </div>
    </div>
  );
};
