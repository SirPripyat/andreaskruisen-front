import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { cn } from '@/lib';
import type { GoalLeader } from '../api';
import { TeamChip } from './team-chip';

const PODIUM_STYLES = [
  { badge: 'bg-accent', order: 'sm:order-2' },
  { badge: 'bg-muted-foreground', order: 'sm:order-1' },
  { badge: 'bg-warning/80', order: 'sm:order-3' },
];

type PodiumCardProps = {
  leader: GoalLeader;
  index: number;
  countLabel: string;
};

export const PodiumCard = ({ index, leader, countLabel }: PodiumCardProps) => {
  const isFirst = index === 0;

  const { badge, order } = PODIUM_STYLES[index];

  return (
    <div
      className={cn(
        'relative flex flex-col items-center gap-2 rounded-2xl border bg-card p-4 text-center shadow-sm mt-4',
        order,
        isFirst && 'sm:pt-8 sm:pb-6 border-accent',
      )}
    >
      <span
        className={cn(
          'absolute -top-3 left-1/2 flex size-7 -translate-x-1/2 items-center justify-center rounded-full font-display font-bold text-white text-xs ring-4 ring-card',
          badge,
          isFirst && 'size-8 text-sm',
        )}
      >
        {index + 1}
      </span>

      <Avatar
        size="lg"
        className={cn(
          isFirst &&
            'size-14! ring-2 ring-accent ring-offset-2 ring-offset-card',
        )}
      >
        <AvatarImage src={leader.player.photoUrl} alt="" />
        <AvatarFallback className={cn(isFirst && 'text-lg!')}>
          {leader.player.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className={'flex min-w-0 flex-col items-center gap-0.5'}>
        <span
          className={cn(
            'truncate font-medium text-md',
            isFirst && 'text-lg font-bold',
          )}
        >
          {leader.player.name}
        </span>

        <TeamChip
          teamId={leader.team.id}
          name={leader.team.name}
          crestUrl={leader.team.crestUrl}
          className={'justify-center text-muted-foreground text-xs'}
        />
      </div>

      <span
        className={cn(
          'font-display font-extrabold text-3xl text-accent',
          isFirst && 'text-5xl',
        )}
      >
        {leader.count}
        <span
          className={
            'ml-1 font-sans font-semibold text-muted-foreground text-xs uppercase'
          }
        >
          {countLabel}
        </span>
      </span>
    </div>
  );
};
