import { CheckIcon } from 'lucide-react';
import { OverallRatingBadge } from '@/components';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
  Badge,
} from '@/components/ui';
import type { RosterPlayer } from '@/features/season/squads';
import { cn, getPositionGroupClassName } from '@/lib';

export const PlayerOption = ({
  player,
  selected,
  onSelect,
}: {
  player: RosterPlayer;
  selected: boolean;
  onSelect: () => void;
}) => {
  return (
    <button
      type={'button'}
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg border p-2 text-left transition-colors',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-transparent hover:bg-muted/50',
      )}
    >
      <Avatar size={'sm'}>
        <AvatarImage src={player.photoUrl} alt={''} />
        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
        {selected && (
          <AvatarBadge>
            <CheckIcon />
          </AvatarBadge>
        )}
      </Avatar>

      <span className={'min-w-0 flex-1'}>
        <span className={'block truncate font-medium text-sm'}>
          {player.name}
        </span>
        <span
          className={'flex items-center gap-1.5 text-muted-foreground text-xs'}
        >
          <Badge
            variant={'outline'}
            className={cn(
              'border-transparent px-1.5 py-0 text-[10px]',
              getPositionGroupClassName(player.position),
            )}
          >
            {player.position}
          </Badge>
          {player.isStarter && <span>{'Titular'}</span>}
        </span>
      </span>

      <OverallRatingBadge rating={player.overallRating} />
    </button>
  );
};
