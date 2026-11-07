import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import type { GoalLeader } from '@/features/season/tournaments';

type TeamLeadersListProps = {
  leaders: GoalLeader[];
  countLabel: string;
  emptyLabel: string;
};

export const TeamLeadersList = ({
  leaders,
  countLabel,
  emptyLabel,
}: TeamLeadersListProps) => {
  if (leaders.length === 0) {
    return <p className={'text-muted-foreground text-sm'}>{emptyLabel}</p>;
  }

  return (
    <div className={'flex flex-col gap-2.5'}>
      {leaders.map((leader, index) => (
        <div key={leader.player.id} className={'flex items-center gap-2.5'}>
          <span
            className={
              'w-4 shrink-0 text-center font-mono text-muted-foreground text-xs tabular-nums'
            }
          >
            {index + 1}
          </span>

          <Avatar size={'sm'}>
            <AvatarImage src={leader.player.photoUrl} alt={''} />
            <AvatarFallback>{leader.player.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <span className={'min-w-0 flex-1 truncate font-medium text-sm'}>
            {leader.player.name}
          </span>

          <span className={'font-mono font-semibold text-sm tabular-nums'}>
            {leader.count}
            <span
              className={
                'ml-1 font-normal font-sans text-muted-foreground text-xs'
              }
            >
              {countLabel}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};
